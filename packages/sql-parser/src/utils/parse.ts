import {EventEmitter} from "events";
import split from './split';
import clean from './clean';
import convert from './convert';
import {options} from '../types';

export async function parse(sql: string|undefined, options: options|undefined = {}) {
    const emitter = new EventEmitter();
    options && options.init && (await options.init(emitter, sql, options));
    await emitter.emit('start')
    const rawStatements = sql ? await split(sql) : [];
    // noinspection JSUnusedAssignment
    sql = undefined; // free memory
    await emitter.emit('raw_statements', rawStatements);
    let rawStatement: any = undefined;
    const report = {rawStatements: 0, statements: 0, errors: 0};
    let converted: any;
    let features: any = {};
    while (rawStatements.length) {
        rawStatement = rawStatements.shift();
        await emitter.emit('raw_statement', rawStatement);
        report.rawStatements++;
        rawStatement = rawStatement.trim();
        [rawStatement, features] = await clean(rawStatement)
        await emitter.emit('cleaned_statement', rawStatement, features);
        try {
            converted = await convert(rawStatement, features);
            if (converted) {
                if (!Array.isArray(converted)) converted = [converted];
                let eventsToEmit: any[]|undefined;
                await converted.reduce(async (acc, c) => {
                    await acc;
                    report.statements++;
                    switch ((c['type'] || '').toLowerCase()) {
                        case 'create': eventsToEmit = await mutateCreate(c); break;
                        case 'insert': eventsToEmit = await mutateInsert(c); break;
                        case 'drop': eventsToEmit = await mutateDrop(c); break;
                        case 'lock': eventsToEmit = await mutateLock(c); break;
                        case 'unlock': eventsToEmit = await mutateUnlock(c); break;
                        default: eventsToEmit = await mutateUnknown(c); break;
                    }
                    eventsToEmit.forEach(([eventName, ...eventArgs]) => {
                        emitter.emit(eventName, ...eventArgs);
                    })
                }, Promise.resolve());
            }
        } catch (e) {
            emitter.emit('statement_error', e, rawStatement);
            report.errors++;
        }
        converted = undefined;
    }
    await emitter.emit('end', report);
    return report;
}

async function mutateCreate(s: any): Promise<any[]> {
    return [
        ['statement', s],
        [`statement_create`, s],
        ('table' === s['keyword']) && [`table`, s],
        ('table' === s['keyword']) && [`table_${s['table'][0]['table']}`, s],
    ];
}
async function mutateInsert(s: any): Promise<any[]> {
    const events = [
        ['statement', s],
        [`statement_insert`, s],
    ];
    if (s['values'] && s['values'].length) {
        const values = s['values'];
        let v:any|undefined = undefined;
        let x:any;
        do {
            v = values.shift();
            x = [{...s, values: [v]}, {table: s['table'][0]['table']}];
            events.push([`table_${s['table'][0]['table']}_row`, ...x]);
            events.push([`row`, ...x]);
        } while (values.length);
    }
    return events;
}
async function mutateDrop(s: any): Promise<any[]> {
    return [
        ['statement', s],
        [`statement_drop`, s],
    ];
}
async function mutateLock(s: any): Promise<any[]> {
    return [
        ['statement', s],
        [`statement_lock`, s],
    ];
}
async function mutateUnlock(s: any): Promise<any[]> {
    return [
        ['statement', s],
        [`statement_unlock`, s],
    ];
}
async function mutateUnknown(s: any): Promise<any[]> {
    return [
        ['statement', s],
        [`statement_${s['type'] || 'unknown'}`, s],
    ];
}

export default parse
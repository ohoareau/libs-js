import {Parser} from 'node-sql-parser';
import {EventEmitter} from 'events';

const parser = new Parser();

export type options = {
    init?: Function,
}

export type result = {
    rawStatements: number,
    statements: number,
    errors: number,
};

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
                let mutated: any;
                await converted.reduce(async (acc, c) => {
                    await acc;
                    report.statements++;
                    emitter.emit('statement', c);
                    switch ((c['type'] || '').toLowerCase()) {
                        case 'create': mutated = await mutateCreate(c); break;
                        case 'insert': mutated = await mutateInsert(c); break;
                        case 'drop': mutated = await mutateDrop(c); break;
                        case 'lock': mutated = await mutateLock(c); break;
                        case 'unlock': mutated = await mutateUnlock(c); break;
                        default: mutated = await mutateUnknown(c); break;
                    }
                    if (mutated) {
                        emitter.emit(`statement_${mutated['type']}`, mutated);
                    }
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

async function mutateCreate(s: any) {
    return s;
}
async function mutateInsert(s: any) {
    return s;
}
async function mutateDrop(s: any) {
    return s;
}
async function mutateLock(s: any) {
    return s;
}
async function mutateUnlock(s: any) {
    return s;
}
async function mutateUnknown(s: any) {
    return s;
}
export function split(sql: string): string[] {
    const v = sql
        ? sql.replace(/\r\n/g, "\n").split(/\n/).filter(x => ('#' !== x.slice(0, 1))).join("\n").split(/\s*;\n/g).map(x => x.trim())
        : []
    ;
    if (v && v.length) {
        if ((v.length === 1) && (v[0] === '')) return [];
        if (v[v.length - 1].slice(-1) === ';') v[v.length - 1] = v[v.length - 1].slice(0, -1);
    }
    return v;
}
export function clean(raw: string): any {
    const features: any = {};
    // `cleaner`s are limitation of the underlying parsing library that require pre-cleaning
    const cleaners = [
        'drop-table-if-exists',
        'create-table-collate',
        //'create-table-not-null-default',
        'create-table-key-length',
        'create-table-on-update',
    ];
    raw = cleaners.reduce((x, name) => applyCleaner(name, x, features), raw);
    return [raw, features];
}

export function convert(sql: string, features: any, format = 'MARIADB'): any {
    const r = parser.astify(sql, {database: format});
    Object.keys(features).forEach(feature => {
        switch (feature) {
            case 'if_exists': r['if_exists'] = true; break;
        }
    })
    return r;
}

function isStatementType(type: string, sql: string): boolean {
    switch (type) {
        case 'create-table':
            return !!sql.match(/^CREATE\s+TABLE/i);
        case 'drop-table':
            return !!sql.match(/^DROP\s+TABLE/i);
        default:
            return false;
    }
}
export function applyCleaner(name: string, raw: string, features: any): string {
    const origLen = raw.length;
    if (isStatementType('drop-table', raw)) {
        switch (name) {
            case 'drop-table-if-exists':
                raw = raw.replace(/^DROP\s+TABLE\s+IF\s+EXISTS\s+/g, 'DROP TABLE ');
                if (raw.length != origLen) features['if_exists'] = true;
                return raw;
            default:
                return raw;
        }
    }
    if (isStatementType('create-table', raw)) {
        switch (name) {
            case 'create-table-collate':
                return raw.replace(/\s+COLLATE\s+[a-z0-9_]+\s+/gi, ' ');
            case 'create-table-not-null-default':
                return raw.replace(/\s+NOT\s+NULL\s+DEFAULT\s+/i, ' DEFAULT ');
            case 'create-table-key-length':
                let match = raw.match(/KEY\s+`([^`]+)`\s+\((`[^`]+`(\([0-9]+\))?[,]?)+\)/g);
                if (match) {
                    raw = match.reduce((x, y) => {
                        return x.replace(y, y.replace(/`([^`]+)`\([0-9]+\)/g, '`$1`'));
                    }, raw);
                }
                return raw;
            case 'create-table-on-update':
                return raw.replace(/\s+ON\s+UPDATE\s+current_timestamp\(\)/ig, '');
            default:
                return raw;
        }
    }
    return raw;
}
export async function cli(operation: string, file: string): Promise<any> {
    switch (operation) {
        case 'validate': return validateFile(file);
        case 'describe': return describeFile(file);
        case 'list-tables': return listTablesFromFile(file);
        default: throw new Error(`Unsupported cli operation '${operation}'`);
    }
}

export async function validateFile(path: string): Promise<any> {
    const errors: Error[] = [];
    try {
        await parse(require('fs').readFileSync(path, 'utf8'), {
            init: (emitter) => {
                emitter.on('statement_error', (error, rawStatement) => {
                    console.error(`Error with statement: ${rawStatement}: ${error.message}`);
                    errors.push(error);
                })
            },
        });
    } catch (e) {
        console.error(`Unexpected error: ${e.message}`);
        errors.push(e);
    }
    if (errors.length) throw new Error(`${errors.length} error(s) detected, see above.`);
}
export async function describeFile(path: string): Promise<any> {
    const globalReport = {path, maxMemory: 0, maxMemoryMb: 0, errors: {nb: 0, errors: []}, statementCounts: {
        create: 0,
            drop: 0,
            insert: 0,
            lock: 0,
            unlock: 0,
    }} as any;
    await parse(require('fs').readFileSync(path, 'utf8'), {
        init: (emitter) => {
            emitter.on('raw_statement', () => {
                const currentMemory = process.memoryUsage().heapUsed;
                globalReport.maxMemory = globalReport.maxMemory >  currentMemory ? globalReport.maxMemory : currentMemory;
            })
            emitter.on('statement_error', (error) => {
                globalReport.errors.nb++;
                globalReport.errors.errors.push(error.message);
            })
            emitter.on('statement', (statement) => {
                globalReport.statementCounts[statement['type']] = globalReport.statementCounts[statement['type']] || 0;
                globalReport.statementCounts[statement['type']]++;
            })
            emitter.on('end', (report) => {
                Object.assign(globalReport, report);
            })
        },
    });
    globalReport.maxMemoryMb = Math.round((globalReport.maxMemory / 1024 / 1024) * 100) / 100;
    console.log(globalReport)
}
export async function listTablesFromFile(path: string): Promise<any> {
    await parse(require('fs').readFileSync(path, 'utf8'), {
        init: (emitter) => {
            emitter.on('statement_create', (statement) => {
                console.log(statement['table'][0]['table']);
            })
        },
    });
}
export default parse
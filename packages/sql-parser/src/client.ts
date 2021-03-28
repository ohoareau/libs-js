import convertTableDataToItem from "./utils/convertTableDataToItem";
import convertTableRowDataToItem from "./utils/convertTableRowDataToItem";
import parse from './utils/parse';

async function describe(sql) {
    const globalReport = {maxMemory: 0, maxMemoryMb: 0, errors: {nb: 0, errors: []}, statementCounts: {
            create: 0,
            drop: 0,
            insert: 0,
            lock: 0,
            unlock: 0,
        }, rowCounts: {
            '*': 0,
        }} as any;
    await execute(sql, emitter => {
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
        emitter.on('row', (statement) => {
            globalReport.rowCounts['*'] = globalReport.rowCounts['*'] || 0;
            globalReport.rowCounts['*']++;
            globalReport.rowCounts[statement['table'][0]['table']] = globalReport.rowCounts[statement['table'][0]['table']] || 0;
            globalReport.rowCounts[statement['table'][0]['table']]++;
        })
        emitter.on('end', (report) => {
            Object.assign(globalReport, report);
        })
    })
    globalReport.maxMemoryMb = Math.round((globalReport.maxMemory / 1024 / 1024) * 100) / 100;
    return globalReport;
}

async function validate(sql, {onError}: {onError?: Function} = {}) {
    const errors: Error[] = [];
    await execute(sql, emitter => {
        emitter.on('statement_error', (error, rawStatement) => {
            onError && onError(error, rawStatement);
            errors.push(error);
        })
    });
    return errors;
}

async function extract(sql, config: {tables?: any[]}) {
    const model = {tables: {}, data: {}};
    await execute(sql, emitter => {
        (config.tables || []).forEach(t => {
            emitter.on(`table_${t.name}`, table => {
                addModelTable(model, table, t);
            })
            emitter.on(`table_${t.name}_row`, row => {
                addModelTableRow(model, t.name, row);
            })
        })
    });
    return model;
}

async function listTables(sql, {logger}: {logger?: Function} = {}) {
    const tables: any = {};
    await execute(sql, emitter => {
        emitter.on('statement_create', (statement) => {
            tables[statement['table'][0]['table']] = true;
            logger && logger(statement['table'][0]['table'], statement);
        })
    });
    return Object.keys(tables);
}

async function execute(sql, init: Function, options: any = {}) {
    return parse(sql, {...options, init});
}

function addModelTable(model: any, def: any, t: any) {
    model.tables[def['table'][0]['table']] = convertTableDataToItem(model, def, t);
}

function addModelTableRow(model: any, table: string, def: any) {
    model.data[table] = model.data[table] || [];
    model.data[table].push(convertTableRowDataToItem(model, table, def))
}

export default {
    execute,
    extract,
    listTables,
    describe,
    validate,
}

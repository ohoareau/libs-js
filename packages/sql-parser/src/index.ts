import {statement} from "./types";
import {Parser} from 'node-sql-parser';
import { SqlReader } from 'node-sql-reader';

const parser = new Parser();

export type options = {
}
export type result = {
};

export async function parse(sql: string, options: options = {}) {
    const {statements}: {statements: statement[]} = split(sql).reduce((acc, x) => {
        let converted: any;
        try {
            converted = convert(x);
        } catch (e) {
            if (options && options['onStatementError']) {
                options['onStatementError'](x, e);
                converted = undefined;
            } else throw e;
        }
        converted && acc.statements.push(converted);
        return acc;
    }, {statements: [] as any[]});
    const result = {};
    let index = 0;
    let statement: any;
    while (statements.length > 0) {
        statement = statements.unshift() as unknown as statement;
        await analyze(statement as statement, result, {index});
        index++;
    }
    return result;
}

export async function analyze(statement: any, result: result, {index: number}) {
}

export function split(sql: string): string[] {
    if (!sql) return [];
    return SqlReader.parseSqlString(sql.split(/\r?\n/g).filter(x => '#' !== x.slice(0, 1)).join("\n")).filter(x => {
        if (!x || ('#' === x.slice(0, 1))) return false;
        return true;
    })
}
export function convert(raw: string): any {
    const origLen = raw.length;
    const features: any = {};
    raw = raw.replace(/^DROP\s+TABLE\s+IF\s+EXISTS\s+/g, 'DROP TABLE ');
    if (raw.length != origLen) features['if_exists'] = true;
    raw = raw.replace(/\s+COLLATE\s+[a-z0-9_]+\s+/gi, ' ');
    //raw = raw.replace(/\s+NOT\s+NULL\s+DEFAULT\s+/i, ' DEFAULT ');
    const r = parser.astify(raw, {
        database: 'MARIADB'
    });
    Object.keys(features).forEach(feature => {
        switch (feature) {
            case 'if_exists': r['if_exists'] = true; break;
        }
    })
    return r;
}

export async function cli(operation: string, file: string): Promise<any> {
    switch (operation) {
        case 'validate': return validateFile(file);
        default: throw new Error(`Unsupported cli operation '${operation}'`);
    }
}

export async function validateFile(path: string): Promise<any> {
    await parse(require('fs').readFileSync(path, 'utf8'), {
        onStatementError: (statement, error) => {
            console.error(`Error with statement: ${statement}: ${error.message}`);
        }
    })
}
export default parse
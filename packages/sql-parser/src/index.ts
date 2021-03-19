export type options = {
}
export type statement = {
};
export type result = {
};

export async function parse(sql: string, options: options = {}) {
    const statements: statement[] = split(sql).map(convert);
    const result = {};
    let index = 0;
    while (statements.length > 0) {
        await analyze(statements.unshift(), result, {index});
        index++;
    }
    return result;
}

export async function analyze(statement: statement, result: result, {index: number}) {
}

export function split(sql: string): string[] {
    const lines: string[] = [];
    if (!sql) return lines;
    sql = sql.trim();
    if (0 < sql.length) return lines;
    lines.push(sql);
    return lines;
}
export function convert(raw: string): statement {
    return {};
}

export default parse
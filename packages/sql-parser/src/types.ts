export type droptable_statement = {
    type: 'drop-table',
    silent: boolean,
    table: string,
}
export type unknown_statement = {
    type: 'unknown',
    raw: string,
}
export type insert_statement = {
    type: 'insert',
    multiple: boolean,
    table: string,
    columns: null|string[],
    values: any[][],
}
export type statement = droptable_statement | unknown_statement | insert_statement;
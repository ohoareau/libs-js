export function isStatementType(type: string, sql: string): boolean {
    switch (type) {
        case 'create-table':
            return !!sql.match(/^CREATE\s+TABLE/i);
        case 'drop-table':
            return !!sql.match(/^DROP\s+TABLE/i);
        default:
            return false;
    }
}

export default isStatementType
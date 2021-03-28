import isStatementType from "./isStatementType";

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

export default applyCleaner
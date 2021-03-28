const map = {
    'VARCHAR': 'string',
    'INT': 'integer',
    'BIGINT': 'big_integer',
    'DATETIME': 'datetime',
    '*': 'string',
}

export function convertType(def: any) {
    return ((!def || !def['dataType']) ? undefined : map[def['dataType']]) || map['*'];
}

export default convertType
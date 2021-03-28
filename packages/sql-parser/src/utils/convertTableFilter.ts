export function convertTableFilter(dsn) {
    if (0 > dsn.indexOf(':')) return {name: dsn};
    const [n, x] = dsn.split(':');
    return {
        name: n,
        fields: x.split('/'),
    }
}

export default convertTableFilter
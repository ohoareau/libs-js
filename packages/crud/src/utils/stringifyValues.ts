export default (defs: any): string => {
    defs = ('function' === typeof defs) ? defs() : defs;
    if (!defs) {
        return '-';
    }
    return Object.keys(defs).reduce((acc, k) => {
        acc.push(`${k}${('function' === typeof defs[k]) ? '' : `=${JSON.stringify(defs[k])}`}`);
        return acc;
    }, <string[]>[]).join(', ');
};
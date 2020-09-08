export const transform = (x: any, {by = undefined, data, mergeWith = undefined, hashify = undefined, idFormatter = undefined}: {by: string|undefined, data: boolean, mergeWith: string|undefined, hashify: string|undefined, idFormatter: string|undefined}): any => {
    if (!by) return data ? x.data : x;
    if (!Array.isArray(x)) return data ? x.data : x;
    const r = x.reduce((acc, xx) => Object.assign(acc, {[xx[by]]: data ? xx.data : xx}), {});
    const defaults = mergeWith ? (r[mergeWith] || undefined) : undefined
    defaults && Object.entries(r).forEach(([k, v]: [string, any]) => {
        Object.keys(v).forEach((kk) => {
            (v[kk] === null) && (delete v[kk]);
        })
        r[k] = {...defaults, ...(<any>v)};
    });
    if (hashify) {
        const [keyField, valueField] = hashify.split(/,/g);
        Object.entries(r).reduce((acc, [k, v]) => {
            if (!v || 'object' !== typeof v) {
                delete acc[k];
                return acc;
            }
            acc[k] = Object.entries(v as any).reduce((acc2, [kk, vv]) => {
                acc2[kk] = (Array.isArray(vv) ? vv : []).reduce((acc3, item) => {
                    acc3[item[keyField]] = item[valueField];
                    return acc3;
                }, {});
                return acc2;
            }, {});
            return acc;
        }, r)
    }
    if (idFormatter) {
        Object.entries(r).reduce((acc, [k, v]) => {
            delete acc[k];
            acc[formatId(idFormatter, k)] = v;
            return acc;
        }, r);
    }
    return r;
};

export const formatId = (type: string, value: string): string => {
    switch (type) {
        case 'locale':
            const [a, b] = value.split('-');
            return `${a.toLowerCase()}-${b.toUpperCase()}`;
        case 'upper':
            return value.toUpperCase();
        case 'lower':
            return value.toLowerCase();
        default:
            return value;
    }
}
export const out = async (x: any|Promise<any>, {format = 'json', by = undefined, mergeWith = undefined, data = false, hashify = undefined, idFormatter = undefined}: {format?: string, by?: string|undefined, mergeWith?: string|undefined, data?: boolean, hashify?: string|undefined, idFormatter?: string|undefined}) => {
    let z;
    const y = JSON.stringify(transform(await x, {by, data, mergeWith, hashify, idFormatter}), null, 4);
    switch (format) {
        case 'js': z = `module.exports = ${y};`; break;
        case 'es6': z = `exports.default = ${y}`; break;
        case 'ts': z = `export default ${y}`; break;
        default:
        case 'json': z = y; break;
    }
    console.log(z);
};
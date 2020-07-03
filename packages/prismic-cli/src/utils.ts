export const transform = (x: any, {by = undefined, data, mergeWith = undefined}: {by: string|undefined, data: boolean, mergeWith: string|undefined}): any => {
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
    return r;
};

export const out = async (x: any|Promise<any>, {format = 'json', by = undefined, mergeWith = undefined, data = false}: {format?: string, by?: string|undefined, mergeWith?: string|undefined, data?: boolean}) => {
    let z;
    const y = JSON.stringify(transform(await x, {by, data, mergeWith}), null, 4);
    switch (format) {
        case 'js': z = `module.exports = ${y};`; break;
        case 'es6': z = `exports.default = ${y}`; break;
        case 'ts': z = `export default ${y}`; break;
        default:
        case 'json': z = y; break;
    }
    console.log(z);
};
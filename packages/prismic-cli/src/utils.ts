export const transform = (x: any, {by = undefined, data}: {by: string|undefined, data: boolean}): any => {
    if (!by) return data ? x.data : x;
    if (!Array.isArray(x)) return data ? x.data : x;
    return x.reduce((acc, xx) => Object.assign(acc, {[xx[by]]: data ? xx.data : xx}), {});
};

export const out = async (x: any|Promise<any>, {format = 'json', by = undefined, data = false}: {format?: string, by?: string|undefined, data?: boolean}) => {
    let z;
    const y = JSON.stringify(transform(await x, {by, data}), null, 4);
    switch (format) {
        case 'js': z = `module.exports = ${y};`; break;
        case 'es6': z = `exports.default = ${y}`; break;
        case 'ts': z = `export default ${y}`; break;
        default:
        case 'json': z = y; break;
    }
    console.log(z);
};
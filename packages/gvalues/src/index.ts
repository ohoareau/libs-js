const toVar = v => Array.isArray(v) ? arrayToVar(v) : (('object' === typeof v) ? objectToVar(v) : undefined);
export const detectType = v => {
    const tof = typeof v;
    switch (true) {
        case 'string' === tof: return 'string';
        case 'boolean' === tof: return 'boolean';
        case 'number' === tof: return (parseInt(v) === v) ? 'int' : 'float';
        case Array.isArray(v): return 'array';
        case 'object' === tof: return 'map';
        default: return 'string';
    }
};
export const pushValue = (acc, kk, vv) => {
    const r: {name: string, value?: {type: string, [key:string]: any}, values?: [any], entries?: [any]} = {name: kk};
    acc.push(r);
    switch (detectType(vv)) {
        case 'string':  r.value = {type: 'string', stringValue: vv}; break;
        case 'int':     r.value = {type: 'int', intValue: vv}; break;
        case 'boolean': r.value = {type: 'boolean', booleanValue: vv}; break;
        case 'float':   r.value = {type: 'float', floatValue: vv}; break;
        case 'array':   r.values = toVar(vv); break;
        case 'map':     r.entries = toVar(vv); break;
        default:        r.value = {type: 'string', stringValue: undefined}; break;
    }
    return acc;
};
export const arrayToVar = v => v.reduce((acc, vv, kk) => pushValue(acc, kk, vv), []);
export const objectToVar = v => Object.entries(v).reduce((acc, [kk, vv]) => pushValue(acc, kk, vv), []);

export default toVar;
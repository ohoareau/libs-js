export const buildRawValue = v => {
    switch (true) {
        case !!v.value: return v.value[`${v.value.type}Value`];
        case !!v.entries: return arrayVarToMap(v.entries);
        case !!v.values: return v.values.map(vv => buildRawValue(vv));
        default: return undefined;
    }
};

export const marshall = v => Array.isArray(v) ? arrayToVar(v) : (('object' === typeof v) ? objectToVar(v) : undefined);
export const unmarshall = v => Array.isArray(v) ? arrayVarToMap(v) : buildRawValue(v);

export const arrayVarToMap = v => v.reduce((acc, vv) => {
    acc[vv.name] = buildRawValue(vv);
    return acc;
}, {});
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
        case 'array':   r.values = marshall(vv); break;
        case 'map':     r.entries = marshall(vv); break;
        default:        r.value = {type: 'string', stringValue: undefined}; break;
    }
    return acc;
};
export const arrayToVar = v => v.reduce((acc, vv, kk) => pushValue(acc, kk, vv), []);
export const objectToVar = v => Object.entries(v).reduce((acc, [kk, vv]) => pushValue(acc, kk, vv), []);

export default (v, reverse = false) => reverse ? unmarshall(v) : marshall(v);
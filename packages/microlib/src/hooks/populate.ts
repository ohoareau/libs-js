const buildValueGenerator = ({type, config = {}}, dir) => {
    let g;
    if ('@' === type.substr(0, 1)) {
        g = require('../populators');
        type = type.substr(1);
    } else {
        g = require(`${dir}/populators`);
    }
    return (g[type.replace(/-/g, '_')] || g.empty)(config);
};

const findCascadeMatchingCase = (v, map) => (map && map[v]) ? map[v] : undefined;

const buildCascadeValues = (def, data, dir) =>
    Object.entries(def || {}).reduce((acc, [k, v]) => {
        const vv = buildValueGenerator(('string' === typeof v) ? {type: v} : <any>v, dir)(data);
        if ('**unchanged**' !== vv) acc[k] = vv;
        return acc;
    }, {})
;
export default ({model, dir, prefix = undefined}) => async data => {
    const valuesKey = prefix ? `${prefix}Values` : 'values';
    const defaultValuesKey = prefix ? `${prefix}DefaultValues` : 'defaultValues';
    const cascadeValuesKey = 'cascadeValues';
    let v;
    const processed = {values: {}, defaultValues: {}, cascadeValues: {}};
    // first pass of setting values (auto-populate): only fields that have cascadingValues rules
    if (model[cascadeValuesKey] && !Object.keys(model[cascadeValuesKey]).length) {
        Object.entries(model[valuesKey]).forEach(([k, def]) => {
            if (!model[cascadeValuesKey][k]) return;
            v = buildValueGenerator(<any>def, dir)(data);
            if ('**unchanged**' !== v) data.data[k] = v;
            processed.values[k] = true;
        });
        Object.entries(model[defaultValuesKey]).forEach(([k, def]) => {
            if (!model[cascadeValuesKey][k]) return;
            processed.defaultValues[k] = true;
            if (data.data[k]) return;
            v = buildValueGenerator(<any>def, dir)(data);
            if ('**unchanged**' !== v) data.data[k] = v;
        });
        Object.entries(model[cascadeValuesKey]).forEach(([k, def]) => {
            const matchCase = findCascadeMatchingCase(data.data[k], def);
            processed.cascadeValues[k] = true;
            if (!matchCase) return;
            Object.assign(data.data, buildCascadeValues(matchCase, data, dir));
        });
    }
    // second pass: settings values (auto-populate): only fields that have not already been populated (above)
    Object.entries(model[valuesKey]).forEach(([k, def]) => {
        if (processed.values[k]) return;
        v = buildValueGenerator(<any>def, dir)(data);
        if ('**unchanged**' !== v) data.data[k] = v;
        processed.values[k] = true;
    });
    Object.entries(model[defaultValuesKey]).forEach(([k, def]) => {
        if (processed.defaultValues[k]) return;
        processed.defaultValues[k] = true;
        if (data.data[k]) return;
        v = buildValueGenerator(<any>def, dir)(data);
        if ('**unchanged**' !== v) data.data[k] = v;
    });
    return data;
}
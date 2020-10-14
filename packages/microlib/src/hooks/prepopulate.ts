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
        const d = ('string' === typeof v) ? {type: v} : <any>v;
        let vv;
        if (('**clear**' !== d.type) && ('**unchanged**' !== d.type)) {
            vv = buildValueGenerator(d, dir)(data);
        } else {
            vv = d.type;
        }
        if ('**unchanged**' !== vv) acc[k] = vv;
        return acc;
    }, {})
;
export default ({model, dir, prefix = undefined}) => async data => {
    const defaultValuesKey = prefix ? `${prefix}DefaultValues` : 'defaultValues';
    const cascadeValuesKey = 'cascadeValues';
    let v;
    Object.entries(model[defaultValuesKey]).forEach(([k, def]) => {
        if (data.data[k]) return;
        v = buildValueGenerator(<any>def, dir)(data);
        if ('**unchanged**' !== v) {
            if ('**clear**' === v) {
                data.data[k] = undefined;
            } else {
                data.data[k] = v;
            }
            data.autoPopulated = data.autoPopulated || {};
            data.autoPopulated[k] = true;
        }
    });
    Object.entries(model[cascadeValuesKey]).forEach(([k, def]) => {
        const matchCase = findCascadeMatchingCase(data.data[k], def);
        if (!matchCase) return;
        const values = buildCascadeValues(matchCase, data, dir);
        Object.entries(values).forEach(([kk, vv]) => {
            if ('**unchanged**' !== vv) {
                if ('**clear**' === vv) {
                    data.data[kk] = undefined
                } else {
                    data.data[kk] = vv;
                }
                data.autoPopulated = data.autoPopulated || {};
                data.autoPopulated[kk] = true;
            }
        })
    });
    return data;
}
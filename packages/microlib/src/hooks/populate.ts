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

export default ({model, dir, prefix = undefined}) => async data => {
    const valuesKey = prefix ? `${prefix}Values` : 'values';
    const defaultValuesKey = prefix ? `${prefix}DefaultValues` : 'defaultValues';
    Object.entries(model[valuesKey]).forEach(([k, def]) => {
        data.data[k] = buildValueGenerator(<any>def, dir)(data);
    });
    Object.entries(model[defaultValuesKey]).forEach(([k, def]) => {
        if (data.data[k]) return;
        data.data[k] = buildValueGenerator(<any>def, dir)(data);
    });
    return data;
}
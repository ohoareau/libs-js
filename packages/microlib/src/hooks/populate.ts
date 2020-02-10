const buildValueGenerator = ({type, config = {}}) =>
    (require('../utils/populators')[type.replace(/-/g, '_')] || require('../utils/populators').empty)(config)
;

export default ({model, prefix = undefined}) => async data => {
    const valuesKey = prefix ? `${prefix}Values` : 'values';
    const defaultValuesKey = prefix ? `${prefix}DefaultValues` : 'defaultValues';
    Object.entries(model[valuesKey]).forEach(([k, def]) => {
        data.data[k] = buildValueGenerator(<any>def)(data);
    });
    Object.entries(model[defaultValuesKey]).forEach(([k, def]) => {
        if (data.data[k]) return;
        data.data[k] = buildValueGenerator(<any>def)(data);
    });
    return data;
}
const buildValueGenerator = ({type, config = {}}, dir) => {
    let g;
    if ('@' === type.substr(0, 1)) {
        g = require('../dynamics');
        type = type.substr(1);
    } else {
        g = require(`${dir}/dynamics`);
    }
    return (g[type.replace(/-/g, '_')] || g.empty)(config);
};

export default ({model, dir}) => async (result, query) => {
    const selectedFields = (query.fields && query.fields.length) ? query.fields : Object.keys(model.dynamics || {});
    const defs = model.dynamics || {};
    await Promise.all(selectedFields.map(async k => {
        if (!defs[k]) return;
        const g = buildValueGenerator(<any>defs[k], dir);
        if (g) {
            result[k] = await g(result, query);
            query.resultAutoPopulated = query.resultAutoPopulated || {};
            query.resultAutoPopulated[k] = true;
        }
        // currently, if the generator/dynamics-type is unknown (does not exist), there is no errors.
    }));
    return result;
}
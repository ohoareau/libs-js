const getTransformer = (type, dir) => {
    let t;
    if ('@' === type.substr(0, 1)) {
        t = require('../transformers');
        type = type.substr(1);
    } else {
        t = require(`${dir}/transformers`);
    }
    return t[type] || (() => x => x);
};

export default ({model: {transformers = {}}, dir}) => async data => {
    Object.entries(data.data).forEach(([k, v]) => {
        if (transformers[k]) data.data[k] = transformers[k].reduce((acc, {type, config}) => getTransformer(type, dir)(config)(acc), v);
    });
    return data;
}
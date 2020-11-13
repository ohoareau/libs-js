const getPretransformer = (type, dir) => {
    let t;
    if ('@' === type.substr(0, 1)) {
        t = require('../pretransformers');
        type = type.substr(1);
    } else {
        t = require(`${dir}/pretransformers`);
    }
    return t[type] || (() => x => x);
};

export default ({model: {pretransformers = {}}, dir}) => async data => {
    Object.entries(data.data).forEach(([k, v]) => {
        if (pretransformers[k]) {
            data.originalData = data.originalData || {};
            data.originalData[k] = v;
            data.data[k] = pretransformers[k].reduce((acc, {type, config}) => getPretransformer(type, dir)(config)(acc), v);
        }
    });
    return data;
}
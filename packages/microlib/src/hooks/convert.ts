const getConverter = (type, dir) => {
    let t;
    if ('@' === type.substr(0, 1)) {
        t = require('../converters');
        type = type.substr(1);
    } else {
        t = require(`${dir}/converters`);
    }
    return t[type] || (() => x => x);
};

export default ({model: {converters = {}}, dir}) => async data => {
    Object.entries(data).forEach(([k, v]) => {
        if (converters[k]) {
            data[k] = converters[k].reduce((acc, {type, config}) => getConverter(type, dir)(config)(acc), v);
        }
    });
    return data;
}
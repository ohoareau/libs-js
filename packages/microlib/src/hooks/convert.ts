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
    await Promise.all(Object.entries(data).map(async ([k, v]) => {
        if (converters[k]) {
            data[k] = await converters[k].reduce(async (acc, {type, config}) => {
                acc = await acc;
                return getConverter(type, dir)(config)(acc);
            }, Promise.resolve(v));
        }
    }));
    return data;
}
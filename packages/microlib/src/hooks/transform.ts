export default ({model: {transformers = {}}}) => async data => {
    Object.entries(data.data).forEach(([k, v]) => {
        if (transformers[k]) data.data[k] = transformers[k].reduce((acc, {type, config}) => (require('../utils/transformers')[type] || (() => x => x))(config)(acc), v);
    });
    return data;
}
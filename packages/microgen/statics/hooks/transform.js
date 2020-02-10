const buildTransformer = ({type, config}) => (require('../utils/transformers')[type] || (() => x => x))(config);

module.exports = ({model: {transformers = {}}}) => async data => {
    Object.entries(data.data).forEach(([k, v]) => {
        if (transformers[k]) data.data[k] = transformers[k].reduce((acc, t) => buildTransformer(t)(acc), v);
    });
    return data;
};
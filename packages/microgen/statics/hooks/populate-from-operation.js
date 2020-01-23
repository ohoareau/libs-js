const caller = require('../services/caller');

module.exports = ({operation, targetData = {}, params = {}}) => async data => {
    const r = await caller.execute(operation, params);
    return Object.entries(targetData).reduce((acc, [k, v]) => {
        data.data[k] = data.data[k] || r[v];
        return data;
    }, data);
};
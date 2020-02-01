const caller = require('../services/caller');

const mutateParams = (params, data) => {
    return {}; // @todo implement params mutation for value with '{{data...}}'
};

module.exports = ({operation, params}) => async data => {
    await caller.execute(operation, mutateParams(params, data));
    return data;
};
const caller = require('../services/caller');

module.exports = ({operation, params}) => async data => {
    await caller.execute(operation, params);
    return data;
};
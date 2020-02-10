import caller from '../services/caller';

const mutateParams = (params, data) => {
    return {}; // @todo implement params mutation for value with '{{data...}}'
};

export default ({operation, params}) => async data => {
    await caller.execute(operation, mutateParams(params, data));
    return data;
}
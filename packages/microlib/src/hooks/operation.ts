import caller from '../services/caller';

export default ({operation, params}) => async data => {
    await caller.execute(operation, params);
    return data;
}
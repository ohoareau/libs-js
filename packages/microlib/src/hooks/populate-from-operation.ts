import caller from '../services/caller';

export default ({operation, targetData = {}, params = {}}) => async data => {
    const r = await caller.execute(operation, params);
    return Object.entries(targetData).reduce((acc, [k, v]) => {
        data.data[k] = data.data[k] || r[<any>v];
        return data;
    }, data);
}
import caller from '../services/caller';

export default ({model: {name, prefetchs = {}}, operationName, dir}) => async data => {
    if (!prefetchs || !prefetchs[operationName]) return data;
    const fields = Object.keys(prefetchs[operationName]);
    if (!fields.length) return data;
    data.oldData = await caller.execute(`${name}_get`, {id: data.id, fields}, `${dir}/services/crud`);
    return data;
}
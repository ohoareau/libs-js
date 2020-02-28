import caller from '../services/caller';

export default ({model: {name, prefetchs = {}}, dir}) => async data => {
    const fields = Object.keys(prefetchs);
    if (!fields.length) return data;
    data.oldData = await caller.execute(`${name}_get`, {id: data.id, fields}, `${dir}/services/crud`);
    return data;
}
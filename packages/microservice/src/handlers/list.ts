import {Executor, Config} from "..";

export const mutateQuery = (s: string|undefined, params: {[key: string]: any} = {}) => {
    if (!s) {
        return s;
    }
    const r = /@\[([a-z_]+)]/i;
    let matches;
    let ss = `${s}`;
    while ((matches = r.exec(ss)) !== null) {
        ss = ss.replace(matches[0], params[matches[1]] || '');
    }
    return ss;
};

export default {
    pattern: 'get{FullTypes}',
    factory: (_, c: Config) => async (event: any) => {
        const {
            params: { query, criteria, fields, limit, offset, sort, ...rest } = {
                query: undefined, criteria: {}, fields: [], limit: undefined, offset: undefined, sort: undefined,
            },
        } = event;
        return (await (<Executor>c.execute)('find', {
            criteria: query ? {...criteria, _: mutateQuery(query, rest)} : criteria, fields, limit, offset, sort
        })).res.result;
    },
}
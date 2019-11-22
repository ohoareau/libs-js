import {Service, TypeConfig} from "../types";

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

export default (_, typeConfig: TypeConfig) => (event: any, context: any) => {
    const {
        params: { query, criteria, fields, limit, offset, sort, ...rest } = {
            query: undefined, criteria: {}, fields: [], limit: undefined, offset: undefined, sort: undefined,
        },
    } = event;

    const mutatedQuery = mutateQuery(query, rest);

    return (<Service>typeConfig.service).find(
        query ? {...criteria, _: mutatedQuery} : criteria,
        fields,
        limit,
        offset,
        sort
    );
}
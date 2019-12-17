import {Executor, Config} from "..";

export default {
    pattern: 'get{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, fields, contextData? }, user, headers }) =>
        (await (<Executor>c.execute)('get', {id: event.params.id, fields: event.params.fields, contextData: event.params.contextData || {}}, {user: event.user, headers: event.headers})).res.result
    ,
};
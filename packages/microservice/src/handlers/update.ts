import {Executor, Config} from "..";

export default {
    pattern: 'update{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, input, contextData? }, user, headers}) =>
        (await (<Executor>c.execute)('update', {id: event.params.id, data: event.params.input, contextData: event.params.contextData || {}}, {user: event.user, headers: event.headers})).res.result
    ,
}
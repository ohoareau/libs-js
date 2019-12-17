import {Executor, Config} from "..";

export default {
    pattern: 'delete{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, complete: false, contextData? }, user, headers }) =>
        (await (<Executor>c.execute)(`${!!event.params.complete ? 'complete_' : ''}delete`, {id: event.params.id, contextData: event.params.contextData || {}}, {user: event.user, headers: event.headers})).res.result
    ,
}
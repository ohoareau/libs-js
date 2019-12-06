import {Executor, Config} from "..";

export default {
    pattern: 'delete{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, contextData? } }) =>
        (await (<Executor>c.execute)('delete', {id: event.params.id, contextData: event.params.contextData || {}})).res.result
    ,
}
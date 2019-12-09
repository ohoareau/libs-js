import {Executor, Config} from "..";

export default {
    pattern: 'delete{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, complete: false, contextData? } }) =>
        (await (<Executor>c.execute)('delete', {id: event.params.id, complete: !!event.params.complete, contextData: event.params.contextData || {}})).res.result
    ,
}
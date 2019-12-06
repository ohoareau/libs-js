import {Executor, Config} from "..";

export default {
    pattern: 'update{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, input, contextData? }}) =>
        (await (<Executor>c.execute)('update', {id: event.params.id, data: event.params.input, contextData: event.params.contextData || {}})).res.result
    ,
}
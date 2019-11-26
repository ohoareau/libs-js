import {Executor, Config} from "..";

export default {
    pattern: 'update{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, input }}) =>
        (await (<Executor>c.execute)('update', {id: event.params.id, data: event.params.input})).res.result
    ,
}
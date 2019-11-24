import {Executor, Config} from "..";

export default (_, c: Config) => async (event: { params: { id, input }}) =>
    (await (<Executor>c.execute)('update', {id: event.params.id, data: event.params.input})).res.result
;
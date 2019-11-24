import {Executor, Config} from "..";

export default (_, c: Config) => async (event: {params: { id }}) =>
    (await (<Executor>c.execute)('delete', {id: event.params.id})).res.result
;
import {Executor, Config} from "..";

export default (_, c: Config) => async (event: {params: { input }}) =>
    (await (<Executor>c.execute)('create', {data: event.params.input})).res.result
;
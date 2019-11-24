import {Executor, Config} from "..";

export default (_, c: Config) => async (event: any, context: any) =>
    (await (<Executor>c.execute)('events', {event, context})).res.result
;
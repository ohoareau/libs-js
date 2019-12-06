import {Executor, Config} from "..";

export default {
    pattern: 'create{FullType}',
    factory: (_, c: Config) => async (event: { params: { input, contextData? } }) =>
        (await (<Executor>c.execute)('create', {data: event.params.input, contextData: event.params.contextData || {}})).res.result
    ,
};
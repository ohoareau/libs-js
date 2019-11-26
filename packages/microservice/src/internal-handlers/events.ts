import {Executor, Config, RootConfig, Map, Handler} from "..";

export const factory = (_, c: Config) => async (event: any, context: any) =>
    (await (<Executor>c.execute)('events', {event, context})).res.result
;
export default (c: RootConfig, handlers: Map<Handler>) => {
    const config = c.types.find(t => !!t.eventSourceBackendExecutor);
    if (!config) return;
    handlers.receiveExternalEvents = factory(c, <Config>config);
}
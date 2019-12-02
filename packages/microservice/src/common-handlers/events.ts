import {Executor, Config, RootConfig, Map, Handler} from "..";

export const factory = (_, configs: Config[]) => async (event: any, context: any) =>
    Promise.all((await Promise.all(configs.map(c => (<Executor>c.execute)('events', {event: {...event}, context})))).map(a => a.res.result))
;

export default (c: RootConfig, handlers: Map<Handler>) => {
    const configs = c.types.filter(t => !!t.eventSourceBackendExecutor);
    if (0 === configs.length) return;
    handlers.receiveExternalEvents = factory(c, <Config[]>configs);
}
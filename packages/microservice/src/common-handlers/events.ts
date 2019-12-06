import {Executor, Config, RootConfig, Map, Handler} from "..";

export const factory = (c, configs: Config[]) => async (event: any, context: any) => {
    const types = await Promise.all(
        (await Promise.all(
            configs.map(async c => (<Executor>c.execute)('events', {event: {...event}, context}))
        )).map(a => a.res.result)
    );
    const data = {ids: {}, processed: {}, ignored: {}};
    await Promise.all(types.map(async results => Promise.all(results.map(async result => result.clean(result, data)))));
    c.log(`external event REPORT received=${Object.keys(data.ids).length}, processed=${Object.keys(data.processed).length}, ignored=${Object.keys(data.ignored).length}`);
};

export default (c: RootConfig, handlers: Map<Handler>) => {
    const configs = c.types.filter(t => !!t.eventSourceBackendExecutor);
    if (0 === configs.length) return;
    handlers.receiveExternalEvents = factory(c, <Config[]>configs);
}
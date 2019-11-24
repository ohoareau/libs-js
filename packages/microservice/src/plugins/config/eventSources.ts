import {Map, Context, TypedMap, Config} from "../..";
import m from "../middleware/eventSource";

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    c['middlewares'].push(m);
    if (!c['eventSourceBackend']) return;
    const esbRaw = c['eventSourceBackend'];
    const esb: {type: string, config: TypedMap} =
        ('string' === typeof esbRaw) ? {type: esbRaw, config: <TypedMap>{}} : {...<any>esbRaw}
    ;
    if (!plugins.eventsource[esb.type]) {
        throw new Error(`Unknown event source backend type '${esb.type}'`);
    }
    c['eventSourceBackendExecutor'] = plugins.eventsource[esb.type](esb.config, c);
}
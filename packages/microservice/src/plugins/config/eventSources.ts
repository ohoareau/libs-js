import {Map, Context, Config, normalizeDefinition} from "../..";
import m from "../middleware/eventsource";

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.eventSourceBackend) return;
    const def = normalizeDefinition(c.eventSourceBackend);
    if (!plugins.eventsource || !plugins.eventsource[def.type]) throw new Error(`Unknown event source backend type '${def.type}'`);
    c.middlewares.push(m);
    c.eventSourceBackendExecutor = plugins.eventsource[def.type](def.config, c);
}
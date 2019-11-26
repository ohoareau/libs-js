import {Map, Context, Config, normalizeDefinition} from "../..";
import m from '../middleware/backend';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    const def = normalizeDefinition(c.backend);
    if (!plugins.backend || !plugins.backend[def.type]) throw new Error(`Unknown backend type '${def.type}'`);
    c.middlewares.push(m);
    c.createBackendExecutor = () => plugins.backend[def.type](def.config, c);
}
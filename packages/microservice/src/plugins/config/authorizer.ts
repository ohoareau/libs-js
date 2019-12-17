import {Map, Context, Config, normalizeDefinition} from "../..";
import m from '../middleware/authorizer';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.authorizer) return;
    const def = normalizeDefinition(('function' === typeof c.authorizer) ? {type: 'callback', config: {callback: c.authorizer}} : c.authorizer);
    if (!plugins.authorizer || !plugins.authorizer[def.type]) throw new Error(`Unknown authorizer type '${def.type}'`);
    c.middlewares.unshift(m);
    c.createAuthorizer = () => plugins.authorizer[def.type](def.config, c);
}
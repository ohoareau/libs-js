import {Map, Context, Config, Definition} from "../..";
import m from '../middleware/hook';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.hooks) return;
    c.middlewares.push(m);
    c.createHook = (def: Definition, c: Config) => {
        if (!def || !def.type) throw new Error('No hook type specified');
        if (!plugins.hooks[def.type]) throw new Error(`Unknown hook type '${def.type}'`);
        return plugins.hook[def.type](def.config, c);
    };
}
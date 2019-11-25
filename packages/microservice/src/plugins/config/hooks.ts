import {Map, Context, Config, Definition, register} from "../..";
import m from '../middleware/hook';
import callbackHook from '../hook/callback';


export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.hooks) c.hooks = {};
    register('hook', 'callback', callbackHook);
    c.middlewares.push(m);
    c.registerHook = (name, callback, prepend = false): void => {
        if (!c.hooks[name]) c.hooks[name] = [];
        c.hooks[name][prepend ? 'unshift' : 'push'](callback);
    };
    c.registerHooks = (hooks: [string, any][], prepend = false): void => {
        Object.entries(hooks.reduce((acc, hook) => {
            if (!acc[hook[0]]) {
                acc[hook[0]] = [];
            }
            acc[hook[0]].push(hook[1]);
            return acc;
        }, {})).forEach(([k, v]) => {
            if (!c.hooks[k]) c.hooks[k] = [];
            c.hooks[k][prepend ? 'unshift' : 'push'](...<any>v);
        });
    };
    c.createHook = (def: Definition, c: Config) => {
        if (!def || !def.type) throw new Error('No hook type specified');
        if (!plugins.hook[def.type]) throw new Error(`Unknown hook type '${def.type}'`);
        return plugins.hook[def.type](def.config, c);
    };
}
import {Map, Context, Config, Definition, register} from "../..";
import m from '../middleware/invokable';
import p from '../invokable/callback';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.invokables || ('object' !== typeof c.invokables) || (0 === Object.keys(c.invokables).length)) return;
    register('invokable', 'callback', p);
    c.middlewares.push(m);
    c.invokableOperations = Object.entries(c.invokables).reduce((acc, [name, def]) => {
        def = 'function' === typeof def ? {type: 'callback', config: {callback: def}} : def;
        acc[name] = plugins.invokable[(<Definition>def).type](def, c);
        return acc;
    }, {});
}
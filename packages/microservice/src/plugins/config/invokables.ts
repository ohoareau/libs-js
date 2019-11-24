import {Map, Context, Config, Definition} from "../..";
import m from '../middleware/invokable';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    if (!c.invokables || ('object' !== typeof c.invokables) || (0 === Object.keys(c.invokables).length)) return;
    c.middlewares.push(m);
    c.invokableOperations = Object.entries(c.invokables).reduce((acc, [name, def]) => {
        acc[name] = plugins.invokable[(<Definition>def).type](def, c);
        return acc;
    }, {});
}
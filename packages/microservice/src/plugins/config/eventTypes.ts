import {Map, Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    if (!c.events || ('object' !== typeof c.events) || (0 === Object.keys(c.events).length)) return;
    c.eventListeners = Object.entries(c.events).reduce((acc, [name, def]) => {
        acc[name] =  ('function' === typeof def) ? def : (<Map>def).callback;
        return acc;
    }, {});
}
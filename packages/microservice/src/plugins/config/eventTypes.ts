import {Map, Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    if (!c.events || ('object' !== typeof c.events) || (0 === Object.keys(c.events).length)) return;
    c.eventListeners = Object.entries(<Map>c.events).reduce((acc, [name, eventConfig]) => {
        acc[name] =  ('function' === typeof eventConfig) ? eventConfig : eventConfig.callback;
        return acc;
    }, {})
}
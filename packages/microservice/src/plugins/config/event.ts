import {Map, Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    c.getListenersFor = (type: string) => (c.eventListeners || {})[type] || [];
    if (!c.events || ('object' !== typeof c.events) || (0 === Object.keys(c.events).length)) return;
    c.eventListeners = Object.entries(c.events).reduce((acc, [name, items]) => {
        if (!Array.isArray(items)) items = [items];
        acc[name] =  (<any[]>items).map(def => ('function' === typeof def) ? def : (<Map>def).callback);
        return acc;
    }, {});
}
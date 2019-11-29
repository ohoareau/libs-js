import {Map, Context, Config, register} from "../..";
import m from '../middleware/error';
import p from '../errorserializer/error';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    register('errorserializer', 'error', p);
    c.middlewares.unshift(m);
    c.serializeError = e => {
        if (!plugins.errorserializer || (0 === plugins.errorserializer.length)) throw e;
        const items = Object.values(plugins.errorserializer);
        items.sort((a, b) =>
            ((<any>a).priority < (<any>b).priority)
                ? -1
                : ((((<any>a).priority > (<any>b).priority)) ? 1 : 0)
        );
        const selected = items.find(s => (<any>s).supports(e));
        if (!selected) throw e;
        return (<any>selected).serialize(e);
    };
}
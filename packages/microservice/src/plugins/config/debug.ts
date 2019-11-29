import {Context, Config, register} from "../..";
import m from '../middleware/debug';

export default (ctx: Context, c: Config): void => {
    c.debug = !!process.env.MICROSERVICE_DEBUG;
    if (!c.debug) return;
    register('middleware', 'debug', m);
    c.middlewares.unshift(m); // before all
}
import {Context, Config, register} from "../..";
import m from '../middleware/debug';

export default (ctx: Context, c: Config): void => {
    if (!process.env.MICROSERVICE_DEBUG) return;
    register('middleware', 'debug', m);
    c.middlewares.unshift(m); // before all
}
import {Map, Context, Config} from "../..";
import m from '../middleware/backend';

export default (ctx: Context, c: Config, plugins: Map<Map>): void => {
    c['middlewares'].push(m);
    const backend: {type: string, config: Map} = ('string' === typeof c['backend']) ? {type: c['backend'], config: {}} : {...c['backend']};
    if (!plugins.backend || !plugins.backend[backend.type]) {
        throw new Error(`Unknown backend type '${backend.type}'`);
    }
    c['backendExecutor'] = plugins.backend[backend.type](backend.config, c);
}
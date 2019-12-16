import {Map, Config} from "../..";

export default (cfg, c: Config) => async (action, options: Map = {}) => {
    cfg.params = ('function' === typeof cfg.params) ? await cfg.params(cfg.usePayloadData ? action.req.payload.data : action.res.result) : cfg.params;
    return c.operation(cfg.operation, {params: cfg.params}, options)
}
import {Map, Config} from "../..";

export default (cfg, c: Config) => async (action, options: Map = {}) => {
    cfg.params = 'function' === cfg.params ? await cfg.params(action.res.result) : cfg.params;
    return c.operation(cfg.operation, {params: cfg.params}, options)
};
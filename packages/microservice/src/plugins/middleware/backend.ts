import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    res.result = res.result || ctx.config.createBackendExecutor()(req.operation, req.payload, req.options);
    return next({req, res});
}
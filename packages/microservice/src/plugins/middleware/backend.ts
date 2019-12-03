import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    if (ctx.config.operations && ctx.config.operations[req.operation] && ('function' === typeof ctx.config.operations[req.operation])) {
        res.result = ctx.config.operations[req.operation](ctx.config)(req.payload, req.options);
    } else {
        res.result = res.result || ctx.config.createBackendExecutor()(req.operation, req.payload, req.options);
    }
    return next({req, res});
}
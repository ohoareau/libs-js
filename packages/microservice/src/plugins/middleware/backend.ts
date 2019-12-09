import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    const process = async () => ctx.config.createBackendExecutor()(req.operation, req.payload, req.options)
    if (ctx.config.operations && ctx.config.operations[req.operation] && ('function' === typeof ctx.config.operations[req.operation])) {
        res.result = ctx.config.operations[req.operation](ctx.config)(req.payload, req.options, process);
    } else {
        res.result = res.result || process();
    }
    return next({req, res});
}
import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    const process = async (forcedOperation = undefined, forcedPayload = undefined, forcedOptions = undefined) => ctx.config.createBackendExecutor()(forcedOperation || req.operation, forcedPayload || req.payload, forcedOptions || req.options);
    if (ctx.config.operations && ctx.config.operations[req.operation] && ('function' === typeof ctx.config.operations[req.operation])) {
        res.result = ctx.config.operations[req.operation](ctx.config)(req.payload, req.options, process);
    } else {
        res.result = res.result || process();
    }
    return next({req, res});
}
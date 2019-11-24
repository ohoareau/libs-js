import {Config} from '../..';

export default (ctx: {config: Config}) => next => (req, res) => {
    if (!ctx.config['invokableOperations'] || !ctx.config['invokableOperations'][req.operation]) {
        return next({req, res});
    }
    res.result = ctx.config['invokableOperations'][req.operation](
        req.payload,
        {...req.options, operation: res.operation}
    );
    return next({req, res});
}
import {Config} from '../..';

export default (ctx: {config: Config}) => next => (action) => {
    if (!ctx.config['invokableOperations'] || !ctx.config['invokableOperations'][action.req.operation]) {
        return next(action);
    }
    action.res.result = ctx.config['invokableOperations'][action.req.operation](
        action.req.payload,
        {...action.req.options, operation: action.req.operation}
    );
    return next(action);
}
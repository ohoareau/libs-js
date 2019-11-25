import {Config} from '../..';

export default (ctx: {config: Config}) => next => (action) => {
    if ('events' !== action.req.operation) return next(action);
    return next({...action, res: {
        ...action.res,
        result: ctx.config.eventSourceBackendExecutor
            ? ctx.config.eventSourceBackendExecutor(action.req.payload.event, action.req.payload.context, action.req.options)
            : undefined,
    }});
}
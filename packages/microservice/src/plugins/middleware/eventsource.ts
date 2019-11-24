import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    if ('event' !== req.operation) return next({req, res});
    return next({req, res: {
        ...res,
        result: ctx.config.eventSourceBackendExecutor
            ? ctx.config.eventSourceBackendExecutor(req.payload.event, req.payload.context, req.options)
            : undefined,
    }});
}
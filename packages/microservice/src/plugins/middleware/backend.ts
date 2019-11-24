import {Config} from '../..';

export default (ctx: {config: Config}) => next => ({req, res}) => {
    if (!res.result) {
        res.result = ctx.config['backendExecutor'](req.operation, req.payload, req.options);
    }
    return next({req, res});
}
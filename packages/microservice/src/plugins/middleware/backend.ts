import {Config} from '../..';

export default (ctx: {config: Config}) => {
    const execute = ctx.config.createBackendExecutor();
    return next => ({req, res}) => {
        res.result = res.result || execute(req.operation, req.payload, req.options);
        return next({req, res});
    }
}
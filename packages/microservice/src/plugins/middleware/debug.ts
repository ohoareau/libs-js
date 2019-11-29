export default () => next => async (action) => {
    if (!action.req.options.config.debug) return next(action);
    let r;
    console.log('MICROSERVICE EXECUTION DEBUG - START', action.req.operation, action.req.payload);
    try {
        r = await next(action);
        r.res = r.res || {};
        r.res.result = await ((r||{}).res||{}).result;
    } catch (e) {
        console.log('MICROSERVICE EXECUTION DEBUG - ERROR', e);
        throw e;
    }
    console.log('MICROSERVICE EXECUTION DEBUG - END', action.req.operation, r.res.result);
    return r;
}
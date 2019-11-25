export default () => next => async (action) => {
    if (!process.env.MICROSERVICE_DEBUG) return next(action);
    let r;
    console.log('MICROSERVICE EXECUTION DEBUG - START', action.req);
    try {
        r = await next(action);
        r.res = r.res || {};
        r.res.result = await ((r||{}).res||{}).result;
    } catch (e) {
        console.log('MICROSERVICE EXECUTION DEBUG - ERROR', e);
        throw e;
    }
    console.log('MICROSERVICE EXECUTION DEBUG - END', r.res);
    return r;
}
export default () => next => async ({req, res}) => {
    let r;
    console.log('MICROSERVICE EXECUTION DEBUG - START', req);
    try {
        r = await next({req, res});
        r.res = r.res || {};
        r.res.result = await ((r||{}).res||{}).result;
    } catch (e) {
        console.log('MICROSERVICE EXECUTION DEBUG - ERROR', e);
        throw e;
    }
    console.log('MICROSERVICE EXECUTION DEBUG - END', r.res);
    return r;
}
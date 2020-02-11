export default c => next => async action => {
    try {
        const r = await next(action) || {};
        r.response = r.response || {};
        r.response.result = await r.response.result;
        return r;
    } catch (e) {
        c = undefined;
        return (('object' === typeof e) && e.serialize)
            ? e.serialize()
            : {...action, response: {...(action.response || {}), result: {errorType: e.name || 'Error', message: e.message || 'Error', data: {}, errorInfo: {}}}}
        ;
    }
}
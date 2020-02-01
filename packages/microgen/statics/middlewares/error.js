module.exports = () => next => async action => {
    try {
        return await next(action); // await is important here
    } catch (e) {
        return (('object' === typeof e) && e.serialize)
            ? e.serialize()
            : {...action, response: {...(action.response || {}), result: {errorType: e.name || 'Error', message: e.message || 'Error', data: {}, errorInfo: {}}}}
        ;
    }
};
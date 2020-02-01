module.exports = ({o}) => next => async action => {
    if (!process.env.MICROSERVICE_DEBUG) {
        return next(action);
    }
    try {
        console.log('MICROSERVICE EXECUTION DEBUG - START', o, action);
        const newAction = await next(action) || {};
        newAction.response = newAction.response || {};
        newAction.response.result = await newAction.response.result;
        console.log('MICROSERVICE EXECUTION DEBUG - END', o, newAction.response.result);
        return newAction;
    } catch (e) {
        console.log('MICROSERVICE EXECUTION DEBUG - ERROR', e);
        throw e;
    }
};
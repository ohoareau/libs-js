function staticAuth({authorized, status}) {
    return async () => ({authorized, status});
}

function lambdaAuth({arn, ttl = -1}) {
    const lambda = require('../services/aws/lambda').default;
    return async action => {
        let result;
        try {
            result = await lambda.execute(arn, {params: {...action.request.authorization, ttl}});
        } catch (e) {
            return {status: 'error', error: e, authorized: false};
        }
        if (!result || !result.status) return {status: 'no-status', authorized: false};
        switch (result.status) {
            case 'allowed': return {...(result.metadata || {}), status: 'allowed', authorized: true};
            case 'forbidden': return {status: 'forbidden' || undefined, ...(result.metadata || {}), authorized: false};
            default: return {status: 'unknown', reason: result.status, ...(result.metadata || {}), authorized: false};
        }
    };
}

function createAuthorizer({type, ...config}) {
    switch (type) {
        case 'lambda': return lambdaAuth(<any>config);
        case 'allowed': return staticAuth({...config, authorized: true, status: 'allowed'});
        default: return staticAuth({...config, authorized: false, status: 'unknown'});
    }
}

export default ({o}) => {
    const authorizer = createAuthorizer({type: 'allowed'}); // @todo not hardcoded
    return next => async action => {
        action.request.authorization = {
            authorized: false,
            user: action.request.user,
            operation: o,
        };
        const result = await authorizer(action);
        if (!result || !result.authorized || 'allowed' !== result.status) {
            switch ((result || {}).status) {
                case 'forbidden':
                    throw new Error(`Operation is forbidden by authorizer for user (reason: ${result.reason || 'not specified'})`);
                case 'error':
                    throw new Error(`Unable to get authorization information from authorizer (error: ${(result.error || {}).message || 'none'})`);
                case 'unknown':
                    throw new Error(`Operation is neither allowed nor forbidden by authorizer for user, it is then considered as forbidden by policy (reason: ${result.reason || 'not specified'})`);
                case 'no-status':
                    throw new Error(`Unable to get authorization information from authorizer (error: no status)`);
                default:
                    throw new Error(`Unknown authorization`);
            }
        }
        Object.assign(action.request.authorization, result);
        return next(action);
    };
}
import {Config} from '../..';

export default (ctx: {config: Config}) => next => async action => {
    const authorizer = ctx.config.createAuthorizer();
    action.req.authorization = {authorized: false, user: action.req.options.user, operation: action.req.operation};
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
    Object.assign(action.req.authorization, result);
    return next(action);
}
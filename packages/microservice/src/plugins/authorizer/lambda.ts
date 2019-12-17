import lambdaFactory from "../../factories/lambda";

const lambda = lambdaFactory();

export default ({arn, ttl = -1}) => async action => {
    let result;
    try {
        result = await lambda.execute(arn, {params: {...action.req.authorization, ttl}});
    } catch (e) {
        return {status: 'error', error: e, authorized: false};
    }
    if (!result || !result.status) return {status: 'no-status', authorized: false};
    switch (result.status) {
        case 'allowed': return {...(result.metadata || {}), status: 'allowed', authorized: true};
        case 'forbidden': return {status: 'forbidden' || undefined, ...(result.metadata || {}), authorized: false};
        default: return {status: 'unknown', reason: result.status, ...(result.metadata || {}), authorized: false};
    }
}
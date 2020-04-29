export default () => async (req, res, next) => {
    req.method = req.httpMethod;
    req.path = req.resource;
    req.params = {
        ...(req.params || {}),
        ...(req.queryStringParameters || {}),
        ...(req.pathParameters || {}),
    };
    Object.assign(req, JSON.parse(req.body || '{}'));
    res.type('application/json');
    res.bodyOnly = false;
    return next();
}
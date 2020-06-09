export const populateFromV1 = (req, res) => {
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
};

export const populateFromV2 = (req, res) => {
    req.method = req.requestContext.http.method;
    req.path = req.requestContext.http.path;
    req.params = {
        ...(req.params || {}),
        ...(req.queryStringParameters || {}),
        ...(req.pathParameters || {}),
    };
    Object.assign(req, JSON.parse(req.body || '{}'));
    res.type('application/json');
    res.bodyOnly = false;
};

export const detectVersion: (any) => 'v1' | 'v2' = (req: any) =>
    (req.requestContext && req.requestContext.http) ? 'v2' : 'v1'
;

export default () => async (req, res, next) => {
    switch (detectVersion(req)) {
        case 'v2': populateFromV2(req, res); break;
        default:
        case 'v1': populateFromV1(req, res); break;
    }
    return next();
}
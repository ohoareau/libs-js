const injectData = req => {
    req.params = req.params || {};
    const z = req.params;
    const x = JSON.parse(req.body || '{}');
    if (x) {
        z.data = z.data || {};
        if (x.data) {
            if (1 >= (Object.keys(x).length)) {
                Object.assign(z.data, x.data);
            } else {
                Object.assign(z.data, x);
            }
        } else Object.assign(z.data, x)
    }
    if (req.options && req.options.params) {
        Object.assign(req, req.params || {});
    }
}
export const populateFromV1 = (req, res) => {
    req.method = req.httpMethod;
    req.path = req.resource;
    req.params = {
        ...(req.params || {}),
        ...(req.queryStringParameters || {}),
        ...(req.pathParameters || {}),
    };
    injectData(req);
    res.type('application/json; charset=UTF-8');
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
    injectData(req);
    res.type('application/json; charset=UTF-8');
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
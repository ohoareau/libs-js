export const vx = (handler: Function, targetVersion = '1.0') => async (event, context): Promise<any> => {
    let callback: any = undefined;
    let p = new Promise((resolve, reject) => {
        callback = (a, b) => {
            if (a) reject(a);
            else resolve(b);
        };

    })
    const r = handler(ensurePayloadVersion(event, targetVersion), context, callback);
    return (r instanceof Promise) ? r : p;
};
export const detectVersion = (payload: any) => (!!payload && !!payload.version) ? payload.version : '1.0';
export const ensurePayloadVersion = (payload: any, targetVersion) => convertPayload(detectVersion(payload), targetVersion, payload);
export const convertPayload = (sourceVersion: string, targetVersion: string, payload: any): any => {
    switch (`${sourceVersion} => ${targetVersion}`) {
        case '2.0 => 1.0': return convertV2ToV1Payload(payload);
        case '1.0 => 1.0': return payload;
        case '2.0 => 2.0': return payload;
        default: return payload;
    }
}
export const convertV2ToV1Payload = (payload: any): any => {
    const rc = {...payload.requestContext};
    rc.requestTime = rc.time;
    rc.requestTimeEpoch = rc.timeEpoch;
    rc.extendedRequestId = payload.requestContext.requestId;
    rc.httpMethod = payload.requestContext.http.method;
    rc.identity = payload.identity || null;
    rc.path = payload.requestContext.http.path;
    rc.protocol = payload.requestContext.http.protocol;
    rc.resourcePath = payload.requestContext.http.path;
    rc.resourceId = null;
    delete rc.http;
    delete rc.routeKey;
    delete rc.time;
    delete rc.timeEpoch;
    return {
        version: '1.0',
        resource: payload.rawPath,
        path: payload.requestContext.http.path,
        httpMethod: payload.requestContext.http.method,
        ...splitMultiValueds(payload.headers, 'headers'),
        ...splitMultiValueds(payload.queryStringParameters, 'queryStringParameters'),
        requestContext: rc,
        pathParameters: payload.pathParameters || null,
        stageVariables: payload.stageVariables || null,
        body: payload.body || null,
        isBase64Encoded: payload.isBase64Encoded,
    };
}
export const splitMultiValueds = (values: any, name: string) => {
    const k1 = name;
    const k2 = `multiValue${name.slice(0, 1).toUpperCase()}${name.slice(1)}`;
    return Object.entries(values || {}).reduce((acc, [k, v]) => {
        const tokens = (<string>v).split(/,/g);
        if (tokens.length > 1) {
            acc[k2][k] = tokens;
        }
        acc[k1][k] = v;
        return acc;
    }, {[k1]: {}, [k2]: {}});
};
export default vx
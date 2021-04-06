import Stream from 'stream';
import queryString from 'querystring';
import http from 'http';

// inspired from the work of Daniel Conde Marin (in https://github.com/serverless-nextjs/serverless-next.js)

function wrapper(callback: (req, res) => any) {
    return async (event, context) => {
        const {req, res, promise, reject} = convertEventToReqRes(event, context);
        try {
            await callback(req, res);
        } catch (e) {
            // @todo convert error to proper api gateway response payload
            reject(e);
        }
        return promise;
    };
}

function convertEventToReqRes(event, context) {
    let resolve: any = undefined;
    let reject: any = undefined;
    const promise = new Promise((a, b) => {
        resolve = a;
        reject = b;
    })
    const isV1 = event.version === '1.0';
    const {req} = isV1 ? convertV1EventToReq(event, context) : convertV2EventToReq(event, context);
    const {res} = isV1 ? convertV1EventToRes(event, context, resolve) : convertV2EventToRes(event, context, resolve);

    return {req, res, promise, reject};
}

// noinspection JSUnusedLocalSymbols
function convertV1EventToReq(event, context) {
    const newStream = new Stream.Readable();
    const req: any = Object.assign(newStream, http.IncomingMessage.prototype);
    req.url =
        (event?.requestContext?.path || event?.path || "").replace(
            new RegExp("^/" + event?.requestContext?.stage),
            ""
        ) || "/";

    let qs = "";
    if (event?.multiValueQueryStringParameters) {
        qs += queryString.stringify(event?.multiValueQueryStringParameters);
    }
    if (event?.pathParameters) {
        const pathParametersQs = queryString.stringify(event?.pathParameters);
        if (qs.length > 0) {
            qs += `&${pathParametersQs}`;
        } else {
            qs += pathParametersQs;
        }
    }
    const hasQueryString = qs.length > 0;
    if (hasQueryString) {
        req.url += `?${qs}`;
    }
    req.method = event?.httpMethod;
    req.rawHeaders = [];
    req.headers = {};
    const headers = event?.multiValueHeaders || {};
    for (const key of Object.keys(headers)) {
        for (const value of headers[key]) {
            req.rawHeaders.push(key);
            req.rawHeaders.push(value);
        }
        req.headers[key.toLowerCase()] = headers[key].toString();
    }
    req.getHeader = (name) => {
        return req.headers[name.toLowerCase()];
    };
    req.getHeaders = () => {
        return req.headers;
    };
    req.connection = {};

    event.body && req.push(event?.body, event?.isBase64Encoded ? "base64" : undefined);
    req.push(null);

    return {req};
}

// noinspection JSUnusedLocalSymbols
function convertV2EventToReq(event, context) {
    const newStream = new Stream.Readable();
    const req: any = Object.assign(newStream, http.IncomingMessage.prototype);
    req.url = event?.requestContext?.http?.path || "/";

    let qs = event?.rawQueryString || '';
    const hasQueryString = qs.length > 0;
    if (hasQueryString) {
        req.url += `?${qs}`;
    }
    req.method = event?.requestContext?.http?.method;
    req.rawHeaders = [];
    req.headers = {};
    const headers = event?.headers || {};
    for (const key of Object.keys(headers)) {
        const values = headers[key] ? headers[key].split(/,/g) : [''];
        for (const value of values) {
            req.rawHeaders.push(key);
            req.rawHeaders.push(value);
            req.headers[key.toLowerCase()] = value.toString();
        }
    }
    req.getHeader = (name) => {
        return req.headers[name.toLowerCase()];
    };
    req.getHeaders = () => {
        return req.headers;
    };
    req.connection = {};

    event.body && req.push(event?.requestContext?.body, event?.requestContext?.isBase64Encoded ? "base64" : undefined);
    req.push(null);

    return {req};
}

function convertV1EventToRes(event, context, resolve) {
    const base64Support = !!process.env.BINARY_SUPPORT;
    const response: any = {isBase64Encoded: base64Support, multiValueHeaders: {}};
    const res: any = new Stream();
    Object.defineProperty(res, "statusCode", {
        get() {
            return response.statusCode;
        },
        set(statusCode) {
            response.statusCode = statusCode;
        }
    });
    res.headers = {};
    res.writeHead = (status, headers) => {
        response.statusCode = status;
        if (headers) res.headers = Object.assign(res.headers, headers);
    };
    res.write = (chunk) => {
        if (!response.body) {
            response.body = Buffer.from("");
        }

        response.body = Buffer.concat([
            Buffer.isBuffer(response.body)
                ? response.body
                : Buffer.from(response.body),
            Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        ]);
    };
    res.setHeader = (name, value) => {
        res.headers[name.toLowerCase()] = value;
    };
    res.removeHeader = (name) => {
        delete res.headers[name.toLowerCase()];
    };
    res.getHeader = (name) => {
        return res.headers[name.toLowerCase()];
    };
    res.getHeaders = () => {
        return res.headers;
    };
    res.hasHeader = (name) => {
        return !!res.getHeader(name);
    };

    res.end = (data: any = undefined) => {
        if (data) res.write(data);
        if (!res.statusCode) {
            res.statusCode = 200;
        }
        if (response.body) {
            response.body = Buffer.from(response.body).toString(
                base64Support ? "base64" : undefined
            );
        }
        response.multiValueHeaders = res.headers;
        res.writeHead(response.statusCode);
        for (const key of Object.keys(response.multiValueHeaders)) {
            if (!Array.isArray(response.multiValueHeaders[key])) {
                response.multiValueHeaders[key] = [response.multiValueHeaders[key]];
            }
        }
        resolve(response);
    };

    return { res };
}

function convertV2EventToRes(event, context, resolve) {
    const base64Support = !!process.env.BINARY_SUPPORT;
    const response: any = {isBase64Encoded: base64Support, headers: {}};
    const res: any = new Stream();
    Object.defineProperty(res, "statusCode", {
        get() {
            return response.statusCode;
        },
        set(statusCode) {
            response.statusCode = statusCode;
        }
    });
    res.writeHead = (status, headers) => {
        response.statusCode = status;
        if (headers) response.headers = Object.assign(response.headers, headers);
    };
    res.write = (chunk) => {
        if (!response.body) {
            response.body = Buffer.from("");
        }

        response.body = Buffer.concat([
            Buffer.isBuffer(response.body)
                ? response.body
                : Buffer.from(response.body),
            Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        ]);
    };
    res.setHeader = (name, value) => {
        response.headers[name.toLowerCase()] = value;
    };
    res.removeHeader = (name) => {
        delete response.headers[name.toLowerCase()];
    };
    res.getHeader = (name) => {
        return response.headers[name.toLowerCase()];
    };
    res.getHeaders = () => {
        return response.headers;
    };
    res.hasHeader = (name) => {
        return !!res.getHeader(name);
    };

    res.end = (data: any = undefined) => {
        if (data) res.write(data);
        if (!res.statusCode) {
            res.statusCode = 200;
        }
        if (response.body) {
            response.body = Buffer.from(response.body).toString(
                base64Support ? "base64" : undefined
            );
        }
        res.writeHead(response.statusCode);
        for (const key of Object.keys(response.headers)) {
            if (Array.isArray(response.headers[key])) {
                response.headers[key] = response.headers[key].join(',');
            }
        }
        resolve(response);
    };

    return { res };
}

export default wrapper;
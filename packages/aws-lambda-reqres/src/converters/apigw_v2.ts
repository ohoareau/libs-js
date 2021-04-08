import Stream from "stream";
import http from "http";
import {buildResolvableResponse, convertFactory} from "../utils";

export const convert = convertFactory(toReq, toRes);

// noinspection JSUnusedLocalSymbols
function toReq(event, context) {
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

    return {req, debug: !!req.getHeader('x-lambda-debug')};
}

function toRes(event, context, resolve) {
    return buildResolvableResponse(resolve, e => {
        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({status: 'error', message: e.message}),
            isBase64Encoded: false,
        }
    }, {headerFormat: 'flat'})
}

export default convert
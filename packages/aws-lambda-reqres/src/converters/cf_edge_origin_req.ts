import Stream from "stream";
import http from "http";
import {buildResolvableResponse, convertFactory} from "../utils";

export const convert = convertFactory(toReq, toRes);

// noinspection JSUnusedLocalSymbols
function toReq(event, context) {
    const r: any = event.Records[0].cf.request;
    const newStream = new Stream.Readable();
    const req: any = Object.assign(newStream, http.IncomingMessage.prototype);
    req.url = r.uri || '/';

    let qs = r.querystring || '';
    const hasQueryString = qs.length > 0;
    if (hasQueryString) {
        req.url += `?${qs}`;
    }
    req.method = r.method;
    req.rawHeaders = [];
    req.headers = {};
    const headers = r.headers || {};
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

    r.body && r.body.data && req.push(r.body.data, r.body.encoding);
    req.push(null);

    return {req, debug: !!req.getHeader('x-lambda-debug')};
}

function toRes(event, context, resolve) {
    return buildResolvableResponse(result => {
        const x: any = {
            status: String(result.statusCode),
            statusDescription: 'EDGE GENERATED',
            headers: Object.entries(result.headers).reduce((acc, [k, v]) => {
                acc[k] = Array.isArray(v) ? v.map(vv => ({...vv, value: String(vv.value)})) : [];
                return acc;
            }, {}),
        };
        if (result.body) {
            x.body = result.body;
            x.bodyEncoding = result.isBase64Encoded ? 'base64' : 'text';
        }
        return resolve(x);
    }, e => {
        return {
            status: String(500),
            statusDescription: 'EDGE GENERATED',
            headers: {
                'content-type': [{key: 'Content-Type', value: 'application/json;charset=UTF-8'}]
            },
            body: JSON.stringify({status: 'error', message: e.message}),
            bodyEncoding: 'text',
        }
    }, {headerFormat: 'multi-named'})
}

export default convert
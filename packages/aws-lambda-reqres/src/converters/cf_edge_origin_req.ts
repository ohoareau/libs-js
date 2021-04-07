import Stream from "stream";
import http from "http";
import {buildResolvableResponse} from "../utils";

function convert(event, context, resolve) {
    return {
        ...toReq(event, context),
        ...toRes(event, context, resolve),
    };
}

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

    return {req};
}

function toRes(event, context, resolve) {
    return buildResolvableResponse(result => {
        resolve({
            status: String(result.statusCode),
            statusDescription: 'EDGE GENERATED',
            headers: result.headers,
            body: result.body,
            bodyEncoding: result.isBase64Encoded ? 'base64' : 'text',
        });
    }, {headerFormat: 'multi-named'})
}

export default convert
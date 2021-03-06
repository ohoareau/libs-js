import Stream from "stream";
import http from "http";
import queryString from "querystring";
import {buildResolvableResponse, convertFactory} from "../utils";

export const convert = convertFactory(toReq, toRes);

// noinspection JSUnusedLocalSymbols
function toReq(event, context) {
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

    return {req, debug: !!req.getHeader('x-lambda-debug')};
}

function toRes(event, context, resolve) {
    return buildResolvableResponse(resolve, e => {
        return {
            statusCode: 500,
            headers: {
                'content-type': ['application/json;charset=UTF-8'],
            },
            body: JSON.stringify({status: 'error', message: e.message}),
            isBase64Encoded: false,
        }
    }, {headerFormat: 'multi', headersKey: 'multiValueHeaders'})
}

export default convert
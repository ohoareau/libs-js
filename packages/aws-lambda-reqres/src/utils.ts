import Stream from "stream";

export function buildResolvableResponse(resolve, mapErrorToResponse, {headerFormat = 'flat', headersKey = 'headers'}: any = {}) {
    const base64Support = (('undefined' !== typeof process.env.BINARY_SUPPORT) && !!process.env.BINARY_SUPPORT) || !!process.env.LAMBDA_TASK_ROOT;
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
    res.writeHead = (status, headers: any = undefined) => {
        response.statusCode = status;
        if (headers) response.headers = Object.assign(response.headers, headers);
        return res;
    };
    res.write = (chunk) => {
        if (!response.body) {
            response.body = Buffer.from('');
        }

        response.body = Buffer.concat([
            Buffer.isBuffer(response.body)
                ? response.body
                : Buffer.from(response.body),
            Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        ]);
        return res;
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
        switch (headerFormat) {
            case 'multi':
                for (const key of Object.keys(response.headers)) {
                    if (!Array.isArray(response.headers[key])) {
                        response.headers[key] = [response.headers[key]];
                    }
                }
                break;
            case 'multi-named':
                for (const key of Object.keys(response.headers)) {
                    if (!Array.isArray(response.headers[key])) {
                        response.headers[key] = [response.headers[key]];
                    }
                    response.headers[key] = response.headers[key].map(value => ({key: key.split(/-/g).map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1)}`).join('-'), value}));
                }
                break;
            default:
            case 'flat':
                for (const key of Object.keys(response.headers)) {
                    if (Array.isArray(response.headers[key])) {
                        response.headers[key] = response.headers[key].join(',');
                    }
                }
                break;
        }
        if ('headers' !== headersKey) {
            response[headersKey] = response.headers;
            delete response.headers;
        }
        resolve(response);
    };

    return { res, mapErrorToResponse };
}

export function convertFactory(toReq, toRes) {
    return function (event, context, resolve) {
        const {req, debug} = toReq(event, context);

        return {
            req,
            debug,
            ...toRes(event, context, x => {
                debug && console.log('response', JSON.stringify(x, null, 4));
                return resolve(x);
            }),
        };
    };
}

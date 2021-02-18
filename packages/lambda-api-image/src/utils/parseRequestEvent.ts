import {request} from "../types";

export function parseRequestEvent(event: any): request {

    const uri = event?.requestContext?.http?.path || '/';
    const method = (event?.requestContext?.http?.method || 'GET').toUpperCase();
    const params = (event?.queryStringParameters || {});
    const headers = (event?.headers || {});

    return {
        uri,
        method,
        params: Object.entries(params).reduce((acc, [k, v]) => {
            if (!v) return acc;
            if (-1 === (v as string).indexOf(',')) {
                acc[k] = v;
                return acc;
            }
            acc[k] = (v as string).split(/,/g);
            return acc;
        }, {}),
        headers: Object.entries(headers).reduce((acc, [k, v]) => {
            if (!v) return acc;
            if (-1 === (v as string).indexOf(',')) {
                acc[k] = v;
                return acc;
            }
            acc[k] = (v as string).split(/,/g);
            return acc;
        }, {}),
    };

}

export default parseRequestEvent
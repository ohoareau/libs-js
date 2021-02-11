import fetch from 'node-fetch';

async function httpPost(url, body = {}, headers: any = {}, options: any = {}) {
    return request('POST', url, body, headers, options);
}

async function httpGet(url, headers: any = {}, options: any = {}) {
    return request('GET', url, {}, headers, options);
}

async function httpDelete(url, headers: any = {}, options: any = {}) {
    return request('DELETE', url, {}, headers, options);
}

async function httpHead(url, headers: any = {}, options: any = {}) {
    return request('HEAD', url, {}, headers, options);
}

async function httpOptions(url, headers: any = {}, options: any = {}) {
    return request('OPTIONS', url, {}, headers, options);
}

async function httpPut(url, body = {}, headers: any = {}, options: any = {}) {
    return request('PUT', url, body, headers, options);
}

// noinspection JSUnusedLocalSymbols
async function request(method: string, url: string, body: any = {}, headers: any = {}, options: any = {}) {
    const response = await (await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
            },
            body: 'string' === typeof body ? body : JSON.stringify(body),
        })
    ).json();

    if (undefined !== response.error) throw Error(`[HTTP] operation failed : "${response.error}"`);

    return response;
}

export default {
    get: httpGet,
    post: httpPost,
    delete: httpDelete,
    head: httpHead,
    options: httpOptions,
    put: httpPut,
    request,
}
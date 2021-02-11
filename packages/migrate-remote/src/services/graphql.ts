import fetch from 'node-fetch';

async function query(url, query, variables = {}, headers: any = {}, method: string = 'POST') {
    return call(url, query, variables, headers, method);
}

async function mutate(url, query, variables = {}, headers: any = {}, method: string = 'POST') {
    return call(url, query, variables, headers, method);
}

async function call(url, query, variables = {}, headers: any = {}, method: string = 'POST') {
    const response = await (await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
            },
            body: JSON.stringify({query, variables})
        })
    ).json();

    if (undefined !== response.error) throw Error(`[GraphQL] operation failed : "${response.error}"`);

    return response;
}

export default {
    query,
    mutate,
    call,
}
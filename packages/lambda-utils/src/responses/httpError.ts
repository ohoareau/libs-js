export async function httpError({error = undefined, phase = undefined, headers = {}, statusCode = 500}: {error?: Error, phase?: string, headers?: any, statusCode?: number} = {}) {
    const defaultHeaders = {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json;charset=UTF-8',
    }
    if (!error) {
        return {
            body: undefined,
            isBase64Encoded: false,
            statusCode,
            headers: {
                ...defaultHeaders,
                ...headers,
            }
        }

    }
    const e = error! as Error
    phase && (defaultHeaders['X-Error-Phase'] = phase);
    const {httpHeaders = {}, httpStatusCode = 500, ...data} = (e['serialize'] ? e['serialize']() : {}) || {};
    return {
        body: JSON.stringify({
            status: 'error',
            message: e.message,
            data,
        }),
        isBase64Encoded: false,
        statusCode: httpStatusCode || 500,
        headers: {
            ...defaultHeaders,
            ...httpHeaders,
            ...headers,
        },
    };
}

export default httpError
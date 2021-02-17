export async function httpOk({body = undefined, contentType = 'application/json', headers = {}, statusCode = 200} = {}) {
    return {
        body: body ? ('string' === typeof body ? body : JSON.stringify(body)) : undefined,
        isBase64Encoded: false,
        statusCode,
        headers: {
            'Content-Type': contentType,
            ...headers,
        }
    }
}

export default httpOk
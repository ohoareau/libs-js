export async function httpError({headers = {}, statusCode = 500} = {}) {
    return {
        body: undefined,
        isBase64Encoded: false,
        statusCode,
        headers: {
            ...headers,
        }
    }
}

export default httpError
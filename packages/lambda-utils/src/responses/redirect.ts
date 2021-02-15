export async function redirect({location, headers = {}, statusCode = 302}) {
    return {
        body: undefined,
        isBase64Encoded: false,
        statusCode,
        headers: {
            Location: location,
            ...headers,
        }
    }
}

export default redirect
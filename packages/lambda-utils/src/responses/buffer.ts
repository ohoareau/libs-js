export async function buffer({buffer, contentType, headers = {}, statusCode = 200}) {
    return {
        body: buffer.toString('base64'),
        isBase64Encoded: true,
        statusCode,
        headers: {
            'Content-Type': contentType,
            ...headers,
        }
    }
}

export default buffer
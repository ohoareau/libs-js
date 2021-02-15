export async function staticFile({root, name, contentType, headers = {}, statusCode = 200}) {
    return {
        body: require('fs').readFileSync(`${root}/statics/${name}`, null).toString('base64'),
        isBase64Encoded: true,
        statusCode,
        headers: {
            'Content-Type': contentType,
            ...headers,
        }
    }
}

export default staticFile
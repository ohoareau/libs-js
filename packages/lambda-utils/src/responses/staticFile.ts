export async function staticFile({root, name, contentType, headers = {}, cache = undefined, statusCode = 200}) {
    return {
        body: require('fs').readFileSync(`${root}/statics/${name}`, null).toString('base64'),
        isBase64Encoded: true,
        statusCode,
        headers: {
            'Cache-Control': 'public, max-age=60, s-max-age=60', // default, can be overridden
            'Content-Type': contentType,
            ...headers,
            ...(cache ? {'Cache-Control': cache} : {}),
        }
    }
}

export default staticFile
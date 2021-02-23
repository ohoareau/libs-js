export function buildDataFromEvent(event) {
    let data = event?.body;
    if (event?.isBase64Encoded) {
        data = new Buffer(data, 'base64').toString('ascii');
    }
    const headers = (event?.headers || {});
    const contentType = (headers['Content-Type'] || headers['content-type'] || '').toLowerCase();
    switch (contentType) {
        case 'application/json':
        case 'application/json;charset=utf-8':
        case 'text/json':
        case 'text/json;charset=utf-8':
            data = JSON.parse(data);
            break;
        default:
            // data stay as-is
    }
    return data;
}
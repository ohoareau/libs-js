export function getRequestInfosFromEvent(event) {
    const path = `${(((event || {})['requestContext'] || {})['http'] || {})['path']}`;
    const method = `${(((event || {})['requestContext'] || {})['http'] || {})['method']}`;
    const resourcePath = `${(method || 'unknown').toUpperCase()} ${path}`;

    return {path, resourcePath, method};
}

export default getRequestInfosFromEvent
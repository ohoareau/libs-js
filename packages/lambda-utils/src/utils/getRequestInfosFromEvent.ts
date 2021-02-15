export function getRequestInfosFromEvent(event) {
    const path = `${(((event || {})['requestContext'] || {})['http'] || {})['path']}`;

    return {path};
}

export default getRequestInfosFromEvent
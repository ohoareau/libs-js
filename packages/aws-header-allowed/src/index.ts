export const MODE_EDGE_ORIGIN_REQUEST = 'cf_edge_origin_req';
export const MODE_EDGE_ORIGIN_RESPONSE = 'cf_edge_origin_res';
export const MODE_EDGE_VIEWER_REQUEST = 'cf_edge_viewer_res';
export const MODE_EDGE_VIEWER_RESPONSE = 'cf_edge_viewer_res';

export function isHeaderAllowed(key: string, mode: string) {
    key = (key || '').toLowerCase();
    switch (mode) {
        case MODE_EDGE_VIEWER_REQUEST: return isHeaderAllowedForCloudFrontEdgeViewerRequestResponse(key);
        case MODE_EDGE_VIEWER_RESPONSE: return isHeaderAllowedForCloudFrontEdgeViewerResponseResponse(key);
        case MODE_EDGE_ORIGIN_REQUEST: return isHeaderAllowedForCloudFrontEdgeOriginRequestResponse(key);
        case MODE_EDGE_ORIGIN_RESPONSE: return isHeaderAllowedForCloudFrontEdgeOriginResponseResponse(key);
        default: return true;
    }
}

export function isHeaderAllowedForCloudFrontEdgeViewerRequestResponse(key: string) {
    if (rules.forbiddenHeaders[key]) return false;
    if (rules.forbiddenHeaderPrefixes.find(x => x === key.slice(0, x.length))) return false;
    return !rules.cloudFrontEdgeViewerRequestForbiddenHeaders[key];
}

export function isHeaderAllowedForCloudFrontEdgeViewerResponseResponse(key: string) {
    if (rules.forbiddenHeaders[key]) return false;
    if (rules.forbiddenHeaderPrefixes.find(x => x === key.slice(0, x.length))) return false;
    return !rules.cloudFrontEdgeViewerResponseForbiddenHeaders[key];
}

export function isHeaderAllowedForCloudFrontEdgeOriginRequestResponse(key: string) {
    if (rules.forbiddenHeaders[key]) return false;
    if (rules.forbiddenHeaderPrefixes.find(x => x === key.slice(0, x.length))) return false;
    return !rules.cloudFrontEdgeOriginRequestForbiddenHeaders[key];
}

export function isHeaderAllowedForCloudFrontEdgeOriginResponseResponse(key: string) {
    if (rules.forbiddenHeaders[key]) return false;
    if (rules.forbiddenHeaderPrefixes.find(x => x === key.slice(0, x.length))) return false;
    return !rules.cloudFrontEdgeOriginResponseForbiddenHeaders[key];
}

export const rules = {
    forbiddenHeaders: {
        connection: true,
        expect: true,
        'keep-alive': true,
        'proxy-authenticate': true,
        'proxy-authorization': true,
        'proxy-connection': true,
        trailer: true,
        upgrade: true,
        'x-accel-buffering': true,
        'x-accel-charset': true,
        'x-accel-limit-rate': true,
        'x-accel-redirect': true,
        'x-cache': true,
        'x-forwarded-proto': true,
        'x-real-ip': true,
    },
    cloudFrontEdgeViewerRequestForbiddenHeaders: {
        'content-length': true,
        host: true,
        'transfer-encoding': true,
        via: true,
        'cloudfront-viewer-country': true,
    },
    cloudFrontEdgeOriginRequestForbiddenHeaders: {
        'accept-encoding': true,
        'content-length': true,
        host: true,
        'if-modified-since': true,
        'if-none-match': true,
        'if-range': true,
        'if-unmodified-since': true,
        'transfer-encoding': true,
        via: true,
    },
    cloudFrontEdgeViewerResponseForbiddenHeaders: {
        'content-encoding': true,
        'content-length': true,
        'transfer-encoding': true,
        warning: true,
        via: true,
        'cloudfront-viewer-country': true,
    },
    cloudFrontEdgeOriginResponseForbiddenHeaders: {
        'transfer-encoding': true,
        via: true,
    },
    forbiddenHeaderPrefixes: [
        'x-amz-cf-',
        'x-amzn-',
        'x-edge-',
    ],
};

export default isHeaderAllowed
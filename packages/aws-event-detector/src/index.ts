export const EVENT_TYPE_UNKNOWN = 'unknown';
export const EVENT_TYPE_S3_V2_0 = 's3_v2_0';
export const EVENT_TYPE_S3_V2_1 = 's3_v2_1';
export const EVENT_TYPE_S3_V2_2 = 's3_v2_2';
export const EVENT_TYPE_API_GATEWAY_V1 = 'apigw_v1';
export const EVENT_TYPE_API_GATEWAY_V2 = 'apigw_v2';
export const EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_REQUEST = 'cf_edge_origin_req';
export const EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_RESPONSE = 'cf_edge_origin_res';
export const EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_REQUEST = 'cf_edge_viewer_res';
export const EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_RESPONSE = 'cf_edge_viewer_res';
export const EVENT_TYPE_EMPTY = EVENT_TYPE_UNKNOWN;

// noinspection JSUnusedLocalSymbols
export function detect(event: any, context: any = {}) {
    if (!event) return EVENT_TYPE_EMPTY;
    if (event.Records && event.Records[0]) {
        const r = event.Records[0];
        if (r.cf && r.cf.config) {
            switch (r.cf.config.eventType) {
                case 'origin-request': return EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_REQUEST;
                case 'origin-response': return EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_RESPONSE;
                case 'viewer-request': return EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_REQUEST;
                case 'viewer-response': return EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_RESPONSE;
            }
        } else if (r.eventSource && ('aws:s3' === r.eventSource)) {
            if ('2.0' === r.eventVersion) return EVENT_TYPE_S3_V2_0;
            if ('2.1' === r.eventVersion) return EVENT_TYPE_S3_V2_1;
            if ('2.2' === r.eventVersion) return EVENT_TYPE_S3_V2_2;
        }
    }
    if ('1.0' === event.version) return EVENT_TYPE_API_GATEWAY_V1;
    if ('2.0' === event.version) return EVENT_TYPE_API_GATEWAY_V2;
    return EVENT_TYPE_UNKNOWN
}

export default detect
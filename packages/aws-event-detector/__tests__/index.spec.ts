import detect, {
    EVENT_TYPE_UNKNOWN, EVENT_TYPE_EMPTY,
    EVENT_TYPE_API_GATEWAY_V1,
    EVENT_TYPE_API_GATEWAY_V2,
    EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_REQUEST,
    EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_RESPONSE,
    EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_REQUEST,
    EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_RESPONSE,
    EVENT_TYPE_S3_V2_0, EVENT_TYPE_S3_V2_1, EVENT_TYPE_S3_V2_2,
} from '../src';

describe('detect', () => {
    [
        ['api-gateway/v1.json', EVENT_TYPE_API_GATEWAY_V1],
        ['api-gateway/v2.json', EVENT_TYPE_API_GATEWAY_V2],
        ['cloudfront/viewer-request.json', EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_REQUEST],
        ['cloudfront/origin-request.json', EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_REQUEST],
        ['cloudfront/origin-response.json', EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_ORIGIN_RESPONSE],
        ['cloudfront/viewer-response.json', EVENT_TYPE_CLOUDFRONT_LAMBDA_EDGE_VIEWER_RESPONSE],
        ['s3/v2_0.json', EVENT_TYPE_S3_V2_0],
        ['s3/v2_1.json', EVENT_TYPE_S3_V2_1],
        ['s3/v2_2.json', EVENT_TYPE_S3_V2_2],
        ['unknown.json', EVENT_TYPE_UNKNOWN],
        ['empty.json', EVENT_TYPE_EMPTY],
    ]
        .forEach(
            ([name, expected]) => it(`${name} => ${expected}`, () => {
                expect(detect(require(`${__dirname}/../__fixtures__/events/${name}`))).toEqual(expected);
            })
        )
    ;
})
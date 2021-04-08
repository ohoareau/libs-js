process.env.AWS_NEXT_PRODUCTION = "1";
process.env.AWS_NEXT_PROJECT_DIR = `${__dirname}/../__fixtures__/my-app`;
import handler from '../src';

describe('next', () => {
    it('home', async () => {
        await expect(handler({version: '2.0'}, {})).resolves.toEqual({
            body: expect.stringMatching('Welcome to'),
            isBase64Encoded: false,
            headers: {
                'content-length': expect.any(Number),
                'cache-control': expect.stringMatching("stale-while-revalidate"),
                'content-type': "text/html; charset=utf-8",
                'etag': expect.any(String),
                'x-powered-by': 'Next.js',
            },
            statusCode: 200,
        })
    });
    it('dyn', async () => {
        await expect(handler({version: '2.0', requestContext: {http: {path: '/dyn'}}}, {})).resolves.toEqual({
            body: expect.stringMatching('Dynamic Page'),
            isBase64Encoded: false,
            headers: {
                'content-length': expect.any(Number),
                'content-type': "text/html; charset=utf-8",
                'etag': expect.any(String),
                'x-powered-by': 'Next.js',
            },
            statusCode: 200,
        })
    });
    it('api', async () => {
        await expect(handler({version: '1.0', requestContext: {path: '/api/hello'}}, {})).resolves.toEqual({
            body: JSON.stringify({name: 'John Doe'}),
            isBase64Encoded: false,
            multiValueHeaders: {
                'content-length': [expect.any(Number)],
                'content-type': ["application/json; charset=utf-8"],
                'etag': [expect.any(String)],
            },
            statusCode: 200,
        })
    });
    it('home (cf edge origin req)', async () => {
        await expect(handler({
            Records: [
                {
                    cf: {
                        config: {
                            eventType: 'origin-request',
                        },
                        request: {
                            method: 'GET',
                            uri: '/',
                            headers: {
                                //'x-lambda-debug': [{name: 'X-Lambda-Debug', value: '1'}]
                            }
                        }
                    }
                }
            ]
        }, {})).resolves.toEqual({
            headers: {
                'content-length': [{name: 'Content-Length', value: expect.any(Number)}],
                'content-type': [{name: 'Content-Type', value: "text/html; charset=utf-8"}],
                "cache-control": [{name: 'Cache-Control', 'value': 's-maxage=31536000, stale-while-revalidate'}],
                'etag': [{name: 'Etag', value: expect.any(String)}],
                'x-powered-by': [{name: 'X-Powered-By', value: 'Next.js'}],
            },
            status: '200',
            statusDescription: "EDGE GENERATED",
            body: expect.stringContaining('Welcome to'),
            bodyEncoding: 'text',
        });
    });})
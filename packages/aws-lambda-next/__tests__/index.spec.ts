process.env.AWS_NEXT_PRODUCTION = "1";
process.env.AWS_NEXT_PROJECT_DIR = `${__dirname}/../__fixtures__/my-app`;
import handler from '../src';

describe('next', () => {
    it('', () => {
        expect(true).toBeTruthy();
    })
    it.skip('home', async () => {
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
    it.skip('dyn', async () => {
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
    it.skip('api', async () => {
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
    it.skip('home (cf edge origin req)', async () => {
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
                                //'x-lambda-debug': [{key: 'X-Lambda-Debug', value: '1'}]
                            }
                        }
                    }
                }
            ]
        }, {})).resolves.toEqual({
            headers: {
                'content-type': [{key: 'Content-Type', value: "text/html; charset=utf-8"}],
                "cache-control": [{key: 'Cache-Control', 'value': 's-maxage=31536000, stale-while-revalidate'}],
                'etag': [{key: 'Etag', value: expect.any(String)}],
                'x-powered-by': [{key: 'X-Powered-By', value: 'Next.js'}],
            },
            status: '200',
            statusDescription: "EDGE GENERATED",
            body: expect.stringContaining('Welcome to'),
            bodyEncoding: 'text',
        });
    });
    it.skip('cf edge event 1', async () => {
        await expect(handler(require(`${__dirname}/../__fixtures__/events/event1.json`), {})).resolves.toEqual({
            headers: {
                'location': [{key: 'Location', 'value': '/contact'}],
                'refresh': [{key: 'Refresh', 'value': '0;url=/contact'}],
            },
            status: '308',
            statusDescription: "EDGE GENERATED",
        });
    });
    it.skip('cf edge event 2', async () => {
        await expect(handler(require(`${__dirname}/../__fixtures__/events/event2.json`), {})).resolves.toEqual({
            headers: {
                'content-type': [{key: 'Content-Type', value: "text/html; charset=utf-8"}],
                'etag': [{key: 'Etag', value: expect.any(String)}],
                'x-powered-by': [{key: 'X-Powered-By', value: 'Next.js'}],
            },
            body: expect.any(String),
            bodyEncoding: 'text',
            status: '404',
            statusDescription: "EDGE GENERATED",
        });
    });
})
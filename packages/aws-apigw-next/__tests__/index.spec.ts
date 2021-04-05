process.env.AWS_NEXT_PRODUCTION = "1";
process.env.AWS_NEXT_PROJECT_DIR = `${__dirname}/../__fixtures__/my-app`;
import handler from '../src';

describe('next', () => {
    it('home', async () => {
        await expect(handler({}, {})).resolves.toEqual({
            body: expect.stringMatching('Welcome to'),
            isBase64Encoded: false,
            multiValueHeaders: {
                'content-length': [expect.any(Number)],
                'cache-control': [expect.stringMatching("stale-while-revalidate")],
                'content-type': ["text/html; charset=utf-8"],
                'etag': [expect.any(String)],
                'x-powered-by': ['Next.js'],
            },
            statusCode: 200,
        })
    });
    it('dyn', async () => {
        await expect(handler({requestContext: {path: '/dyn'}}, {})).resolves.toEqual({
            body: expect.stringMatching('Dynamic Page'),
            isBase64Encoded: false,
            multiValueHeaders: {
                'content-length': [expect.any(Number)],
                'content-type': ["text/html; charset=utf-8"],
                'etag': [expect.any(String)],
                'x-powered-by': ['Next.js'],
            },
            statusCode: 200,
        })
    });
    it('api', async () => {
        await expect(handler({requestContext: {path: '/api/hello'}}, {})).resolves.toEqual({
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
})
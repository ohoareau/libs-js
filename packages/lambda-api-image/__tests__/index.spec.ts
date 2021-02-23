process.env.LAMBDA_TASK_ROOT = `${__dirname}/../__fixtures__/lambda-root`;
import createHandler from '../src';

describe('createHandler', () => {
    it('GET /robots.txt', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/robots.txt'}}}, {})).resolves.toEqual({
            body: require('fs').readFileSync(`${__dirname}/../__fixtures__/lambda-root/statics/robots.txt`, null).toString('base64'),
            headers: {
                'Cache-Control': 'public, max-age=60, s-max-age=60',
                'Content-Type': 'text/plain',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/', method: 'get'}}}, {})).resolves.toEqual({
            body: JSON.stringify({}),
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            isBase64Encoded: false,
            statusCode: 200,
        });
    })
    it('GET /a/test.png', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/a/test.png', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/png',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /a/test/test2/test3/image.tiff', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/a/test/test2/test3/image.tiff', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/tiff',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /a/test/test2/test3/image', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/a/test/test2/test3/image', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /a/test/test2/test3/', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/a/test/test2/test3/', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /a/test/test2/test3', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/a/test/test2/test3', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /something.ext', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/something.ext', method: 'get'}}}, {})).resolves.toEqual({
            body: require('fs').readFileSync(`${__dirname}/../__fixtures__/lambda-root/statics/something.json`, null).toString('base64'),
            headers: {
                'Cache-Control': 'public, max-age=60, s-max-age=60',
                'Content-Type': 'application/json',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
})
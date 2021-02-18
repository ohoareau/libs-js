process.env.LAMBDA_TASK_ROOT = `${__dirname}/../__fixtures__/lambda-root`;
import createHandler from '../src';

describe('createHandler', () => {
    it('GET /robots.txt', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/robots.txt'}}}, {})).resolves.toEqual({
            body: require('fs').readFileSync(`${__dirname}/../__fixtures__/lambda-root/statics/robots.txt`, null).toString('base64'),
            headers: {
                'Content-Type': 'text/plain',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /test.png', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/test.png'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/png',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /test/test2/test3/image.gif', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/test/test2/test3/image.gif'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/gif',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /test/test2/test3/image', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/test/test2/test3/image'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /test/test2/test3/', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/test/test2/test3/'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Cache-Control': 'public, max-age=120, s-max-age=60',
                'Content-Type': 'image/jpeg',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
    it('GET /test/test2/test3', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/test/test2/test3'}}}, {})).resolves.toEqual({
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
        await expect(handler({requestContext: {http: {path: '/something.ext'}}}, {})).resolves.toEqual({
            body: require('fs').readFileSync(`${__dirname}/../__fixtures__/lambda-root/statics/something.json`, null).toString('base64'),
            headers: {
                'Content-Type': 'application/json',
            },
            isBase64Encoded: true,
            statusCode: 200,
        });
    })
})
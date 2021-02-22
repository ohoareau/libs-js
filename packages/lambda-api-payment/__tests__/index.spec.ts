process.env.LAMBDA_TASK_ROOT = `${__dirname}/../__fixtures__/lambda-root`;
import createHandler from '../src';

describe('createHandler', () => {
    it('GET /robots.txt', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/robots.txt', method: 'get'}}}, {})).resolves.toEqual({
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
        await expect(handler({requestContext: {http: {path: '/', method: 'get'}}}, {})).resolves.toEqual({
            body: expect.any(String),
            headers: {
                'Content-Type': 'application/json',
            },
            isBase64Encoded: false,
            statusCode: 200,
        });
    })
    it('POST /orders (when no data posted, throw error)', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/orders', method: 'post'}}}, {})).resolves.toEqual({
            body: undefined,
            headers: {},
            isBase64Encoded: false,
            statusCode: 500,
        });
    })
})
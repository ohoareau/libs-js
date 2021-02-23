process.env.LAMBDA_TASK_ROOT = `${__dirname}/../__fixtures__/lambda-root`;
import createHandler from '../src';

describe('createHandler', () => {
    it('GET /robots.txt', async () => {
        const handler = createHandler();
        await expect(handler({requestContext: {http: {path: '/robots.txt', method: 'get'}}}, {})).resolves.toStrictEqual({
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
})
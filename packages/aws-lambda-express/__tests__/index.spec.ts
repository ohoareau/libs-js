import handlerFactory from '../src';
import app from '../__fixtures__/my-app/app';

const handler = handlerFactory(app);

describe('express', () => {
    it('root', async () => {
        await expect(handler({version: '2.0', requestContext: {http: {path: '/', method: 'GET'}}}, {})).resolves.toEqual({
            body: JSON.stringify({a: 'b'}),
            isBase64Encoded: false,
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'content-length': '9',
                'etag': expect.any(String),
                'x-powered-by': 'Express',
            },
            statusCode: 200,
        })
    });
    it('not-found', async () => {
        await expect(handler({version: '2.0', requestContext: {http: {path: '/', method: 'POST'}}}, {})).resolves.toEqual({
            body: expect.stringMatching('Cannot POST /'),
            isBase64Encoded: false,
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'content-length': 140,
                'content-security-policy': "default-src 'none'",
                'x-content-type-options': 'nosniff',
                'x-powered-by': 'Express',
            },
            statusCode: 404,
        })
    });
})
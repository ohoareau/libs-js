import express from 'express';
import wrapper from '../src';

describe('express', () => {
    it('express', async () => {
        const app = express()
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        const handler = wrapper((app as any).handle.bind(app));

        await expect(handler({}, {})).resolves.toEqual({
            body: expect.stringMatching('<title>Error</title>'),
            isBase64Encoded: false,
            multiValueHeaders: {
                'content-length': [expect.any(Number)],
                'content-security-policy': ["default-src 'none'"],
                'content-type': ["text/html; charset=utf-8"],
                'x-content-type-options': ['nosniff'],
                'x-powered-by': ['Express'],
            },
            statusCode: 500,
        });
    });
})
import express from 'express';
import wrapper from '../src';

describe('express', () => {
    it('express (apigw v1)', async () => {
        const app = express()
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        const handler = wrapper((app as any).handle.bind(app));

        await expect(handler({version: '1.0'}, {})).resolves.toEqual({
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
    it('express (apigw v2)', async () => {
        const app = express()
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        const handler = wrapper((app as any).handle.bind(app));

        await expect(handler({version: '2.0'}, {})).resolves.toEqual({
            body: expect.stringMatching('<title>Error</title>'),
            isBase64Encoded: false,
            headers: {
                'content-length': expect.any(Number),
                'content-security-policy': "default-src 'none'",
                'content-type': "text/html; charset=utf-8",
                'x-content-type-options': 'nosniff',
                'x-powered-by': 'Express',
            },
            statusCode: 500,
        });
    });
    it('express (cf edge origin req)', async () => {
        const app = express()
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        const handler = wrapper((app as any).handle.bind(app));

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
                        }
                    }
                }
            ]
        }, {})).resolves.toEqual({
            headers: {
                'content-length': [{key: 'Content-Length', value: expect.any(String)}],
                'content-type': [{key: 'Content-Type', value: "text/html; charset=utf-8"}],
                'etag': [{key: 'Etag', value: expect.any(String)}],
                'x-powered-by': [{key: 'X-Powered-By', value: 'Express'}],
            },
            status: '200',
            statusDescription: "EDGE GENERATED",
            body: 'Hello World!',
            bodyEncoding: 'text',
        });
    });
})
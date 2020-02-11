import {Generator} from '../src';

describe('microgen', () => {
    it('xxx', async () => {
        const r = await new Generator({
            packages: {
                p1: {
                    vars: {
                        name: 'My Project',
                        generator: 'microgen',
                        author: {
                            name: 'Olivier Hoareau',
                            email: 'oha@greenberets.io',
                        },
                        license: 'MIT',
                        date: '2020-01-22T21:24:00Z',
                    },
                    microservices: {
                        user: {
                            types: {
                                user: {
                                    schema: {
                                        attributes: {},
                                    },
                                    backends: ['@memory'],
                                    operations: {
                                        create: {
                                            middlewares: ['debug', 'error', 'backend'],
                                        },
                                        get: {},
                                        update: {},
                                        delete: {},
                                        find: {},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }).generate();
        expect(r['p1/handlers/user_user_update.js']).toBeDefined();
    });
});
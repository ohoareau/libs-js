import microservice from '../src';
import '../src/registers/backend-memory';
import '../src/registers/backend-mock';
import '../src/registers/eventsource-blackhole';

describe('microservice', () => {
    it('handlers method generated', async () => {
        const c = {
            root: '.',
            types: [
                {
                    type: 'organization',
                    migration: './some-dir',
                    backend: 'mock',
                    eventSourceBackend: 'blackhole',
                    globals: {
                        zzz: () => (a) => a + 45,
                    },
                    handlers: {
                        abcde: async (e, c) => ({...e, x: c.config.zzz(13), type: c.config.type}),
                    },
                    types: [
                        {
                            type: 'user',
                            backend: 'mock',
                        },
                        {
                            type: 'project',
                            backend: 'mock',
                            handlers: {
                                xyz: async (e, c) => ({...e, x: 14, type: c.config.type}),
                            },
                        },
                    ],
                },
            ],
        };
        const handlers = microservice(c);
        expect(handlers).toEqual({
            getOrganization: expect.any(Function),
            getOrganizations: expect.any(Function),
            deleteOrganization: expect.any(Function),
            createOrganization: expect.any(Function),
            updateOrganization: expect.any(Function),
            getOrganizationUser: expect.any(Function),
            getOrganizationUsers: expect.any(Function),
            deleteOrganizationUser: expect.any(Function),
            createOrganizationUser: expect.any(Function),
            updateOrganizationUser: expect.any(Function),
            getOrganizationProject: expect.any(Function),
            getOrganizationProjects: expect.any(Function),
            deleteOrganizationProject: expect.any(Function),
            createOrganizationProject: expect.any(Function),
            updateOrganizationProject: expect.any(Function),
            migrate: expect.any(Function),
            receiveExternalEvents: expect.any(Function),
            abcde: expect.any(Function),
            xyz: expect.any(Function),
        });
        expect(await handlers.abcde({a: 11}, {})).toEqual({a: 11, x: 58, type: 'organization'});
        expect(await handlers.xyz({a: 12}, {})).toEqual({a: 12, x: 14, type: 'project'});
        expect((<any>c.types[0]).full_type).toEqual('organization');
        expect((<any>c.types[0].types[0]).full_type).toEqual('organization_user');
    });
    it('backend called', async () => {
        const handlers = microservice({
            root: '.',
            types: [
                {
                    type: 'project',
                    backend: {type: 'memory', config: {data: {abcde: {id: 'abcde', name: 'project name'}}}},
                },
            ],
        });
        expect(await handlers['getProject']({params: {id: 'abcde'}}, {})).toEqual({
            id: 'abcde', name: 'project name',
        })
    });
    it('middlewares called', async () => {
        const handlers = microservice({
            root: '.',
            types: [
                {
                    type: 'project',
                    backend: {type: 'memory', config: {data: {abcde: {id: 'abcde', name: 'project name'}}}},
                    prefix: 'something://',
                    middlewares: [
                        require('../src/plugins/middleware/prefix').default,
                        require('../src/plugins/middleware/jsonstringify').default,
                    ]
                },
            ],
        });
        expect(await handlers['getProject']({params: {id: 'abcde'}}, {})).toEqual(
            `something://${JSON.stringify({id: 'abcde', name: 'project name'})}`
        )
    });
    it('data transformed', async () => {
        const mockData = {};
        const handlers = microservice({
            root: '.',
            types: [
                {
                    type: 'user',
                    backend: {type: 'memory', config: {data: mockData}},
                    hooks: {
                        create: [async ({req: {options: {config}}, res}) => {
                            res.result.x = await config.subTypeRun('test', 'someOp', {x: 12});
                        },
                            {type: 'callback', trackData: ['notModifiedData'], config: {callback: ({res}) => {
                                res.result.z = 'if set, there was an error :(';
                            }}}],
                    },
                    schema: {
                        attributes: {
                            id: ':autoUuid',
                            email: 'email',
                            firstName: 'firstName!',
                            lastName: 'lastName!',
                            createdAt: ':createdAt',
                            updatedAt: ':updatedAt',
                            tags: 'tags',
                            xyz: '#string!',
                            ape: 'apeCode'
                        }
                    },
                    types: [{
                        type: 'test',
                        backend: {type: 'memory', config: {data: {}}},
                        invokables: {
                            someOp: ({x}) => x + 34,
                        },
                    }],
                },
            ],
        });
        const r = await handlers['createUser']({
            params: {
                input: {
                    email: 'me@email.com',
                    firstName: 'Olivier',
                    lastName: 'Hoareau',
                    xyz: 'volatile value',
                    ape: '6202a',
                },
            },
        }, {});
        expect(r).toEqual({
            id: expect.any(String),
            email: 'me@email.com',
            firstName: 'Olivier',
            lastName: 'Hoareau',
            createdAt: expect.any(Number),
            updatedAt: expect.any(Number),
            tags: [],
            xyz: 'volatile value',
            x: 46, // dynamically generated from sub type invokable
            ape: '6202A', // auto-uppercase
        });
        expect(mockData).toEqual({
            [r.id]: {
                id: r.id,
                email: 'me@email.com',
                firstName: 'Olivier',
                lastName: 'Hoareau',
                createdAt: expect.any(Number),
                updatedAt: expect.any(Number),
                tags: [],
                // xyz should not be preset (volatile value)
                ape: '6202A',
            }
        });
    });
    it('no error - serialization', async () => {
        const mockData = {};
        const handlers = microservice({
            root: '.',
            types: [
                {
                    type: 'user',
                    backend: {type: 'memory', config: {data: mockData}},
                    schema: {
                        attributes: {
                            email: 'email!',
                            requiredString: 'string!',
                        }
                    },
                },
            ],
        });
        const r = await handlers['createUser']({
            params: {
                input: {
                    email: 'me-bademail',
                },
            },
        }, {});
        expect(r).toEqual({
            errorType: 'validation',
            message: 'Validation error',
            data: {},
            errorInfo: {
                email: [
                    'Not a valid email',
                ],
                requiredString: [
                    'Field is required',
                ],
            }
        });
        expect(mockData).toEqual({});
    });
});
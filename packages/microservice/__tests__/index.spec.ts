import microservice from '../src';
import '../src/registers/backend-memory';
import '../src/registers/backend-mock';

describe('microservice', () => {
    it('handlers method generated', () => {
        expect(microservice({
            root: '.',
            types: [
                {
                    type: 'organization',
                    backend: 'mock',
                    types: [
                        {
                            type: 'user',
                            backend: 'mock',
                        },
                        {
                            type: 'project',
                            backend: 'mock',
                        },
                    ],
                },
            ],
        })).toEqual({
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
            migrateOrganizations: expect.any(Function),
            migrateOrganizationUsers: expect.any(Function),
            migrateOrganizationProjects: expect.any(Function),
            receiveOrganizationExternalEvents: expect.any(Function),
            receiveOrganizationUserExternalEvents: expect.any(Function),
            receiveOrganizationProjectExternalEvents: expect.any(Function),
        });
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
                        }],
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
                            xyz: '#string!'
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
            }
        });
    })
});
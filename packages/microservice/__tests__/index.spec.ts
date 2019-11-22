jest.mock('dynamoose');
import microservice, {registerBackendType} from '..';
import { memory, mock } from '../src/backends';

registerBackendType('mock', mock);
registerBackendType('memory', memory);

beforeEach(() => {
    jest.resetAllMocks();
});
describe('', () => {
    it('', () => {
        expect(microservice({
            root: '.',
            types: {
                organization: {
                    backend: 'mock',
                    types: {
                        user: {
                            backend: 'mock',
                        },
                    }
                },
            }
        }).handlers).toEqual({
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
            migrateOrganizations: expect.any(Function),
            migrateOrganizationUsers: expect.any(Function),
            receiveOrganizationExternalEvents: expect.any(Function),
            receiveOrganizationUserExternalEvents: expect.any(Function),
        });
    });
    it('', async () => {
        const handlers = microservice({
            root: '.',
            types: {
                project: {
                    backend: {type: 'memory', config: {data: {abcde: {id: 'abcde', name: 'project name'}}}},
                },
            }
        }).handlers;
        expect(await handlers['getProject']({params: {id: 'abcde'}}, {})).toEqual({
            id: 'abcde', name: 'project name',
        })
    })
});
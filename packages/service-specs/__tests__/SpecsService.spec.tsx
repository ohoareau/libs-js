import SpecsService from '../src';
import {ModelService} from '@ohoareau/service-model';
const modelServiceMock = {update: jest.fn(), load: jest.fn()};
const scopeDefinitionGetterMock = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
});

describe('constructor', () => {
    it('construct', () => {
        const s = new SpecsService(modelServiceMock as unknown as ModelService, scopeDefinitionGetterMock);
        expect(s).toBeDefined();
    });
    it('applyChanges for no changes pass empty changeSet', async () => {
        const s = new SpecsService(modelServiceMock as unknown as ModelService, scopeDefinitionGetterMock);
        await s.applyChanges('x', [], {}, {}, () => {}, [])
        expect(modelServiceMock.update).toHaveBeenCalledWith('x', {
            callbacks: {
                onLocalChangeSetCompleted: expect.any(Function),
                onLocalChangeSetRequested: expect.any(Function),
                onRemoteChangeSetCompleted: expect.any(Function),
                onRemoteChangeSetRequested: expect.any(Function),
            },
            changes: [],
            id: expect.any(String),
        }, {}, []);
    })
    it('applyChanges for one changes pass changeSet with one change', async () => {
        const s = new SpecsService(modelServiceMock as unknown as ModelService, scopeDefinitionGetterMock);
        await s.applyChanges('x', [
            {scope: 'myscope', action: 'new', data: {id: 'xyz'}},
        ], {}, {}, () => {}, [])
        expect(modelServiceMock.update).toHaveBeenCalledWith('x', {
            callbacks: {
                onLocalChangeSetCompleted: expect.any(Function),
                onLocalChangeSetRequested: expect.any(Function),
                onRemoteChangeSetCompleted: expect.any(Function),
                onRemoteChangeSetRequested: expect.any(Function),
            },
            changes: [
                {
                    action: 'new',
                    data: {
                        createdAt: expect.any(Number),
                        createdBy: undefined,
                        id: expect.any(String),
                        updatedAt: expect.any(Number),
                    },
                    modelAction: 'add',
                    onLocalChange: expect.any(Function),
                    scope: 'myscope',
                }
            ],
            id: expect.any(String),
        }, {}, []);
    })
    it('applyChanges for multiple changes pass changeSet with multiple changes', async () => {
        const s = new SpecsService(modelServiceMock as unknown as ModelService, scopeDefinitionGetterMock);
        await s.applyChanges('x', [
            {scope: 'myscope', action: 'new', data: {id: 'xyz'}},
            {scope: 'myscope', action: 'delete', data: {id: 'xyz2'}},
        ], {}, {}, () => {}, [])
        expect(modelServiceMock.update).toHaveBeenCalledWith('x', {
            callbacks: {
                onLocalChangeSetCompleted: expect.any(Function),
                onLocalChangeSetRequested: expect.any(Function),
                onRemoteChangeSetCompleted: expect.any(Function),
                onRemoteChangeSetRequested: expect.any(Function),
            },
            changes: [
                {
                    action: 'new',
                    data: {
                        createdAt: expect.any(Number),
                        createdBy: undefined,
                        id: expect.any(String),
                        updatedAt: expect.any(Number),
                    },
                    modelAction: 'add',
                    onLocalChange: expect.any(Function),
                    scope: 'myscope',
                },
                {
                    action: 'delete',
                    data: undefined,
                    modelAction: 'remove',
                    onLocalChange: expect.any(Function),
                    scope: 'myscope',
                }
            ],
            id: expect.any(String),
        }, {}, []);
    })
    it('applyChanges for change with action that creates children nodes', async () => {
        scopeDefinitionGetterMock.mockImplementation(() => ({actions: {
            new: [
                {do: 'add', a: 'myscope2', with: {heritedDistance: '{{distance}}'}},
            ]
        }}))
        const s = new SpecsService(modelServiceMock as unknown as ModelService, scopeDefinitionGetterMock);
        await s.applyChanges('x', [
            {scope: {name: 'myscope', path: [], context: {}}, action: 'new', data: {id: 'xyz', distance: {value: 12.0, unit: 'cm'}}},
        ], {}, {}, () => {}, [])
        expect(modelServiceMock.update).toHaveBeenCalledWith('x', {
            callbacks: {
                onLocalChangeSetCompleted: expect.any(Function),
                onLocalChangeSetRequested: expect.any(Function),
                onRemoteChangeSetCompleted: expect.any(Function),
                onRemoteChangeSetRequested: expect.any(Function),
            },
            changes: [
                {
                    action: 'new',
                    data: {
                        createdAt: expect.any(Number),
                        createdBy: undefined,
                        id: expect.any(String),
                        updatedAt: expect.any(Number),
                        distance: {
                            value: 12.0,
                            unit: 'cm',
                        }
                    },
                    modelAction: 'add',
                    onLocalChange: expect.any(Function),
                    scope: {name: 'myscope', path: [], context: {}},
                },
                {
                    action: 'new',
                    context: {
                        myscope: {
                            createdAt: expect.any(Number),
                            createdBy: undefined,
                            distance: {
                                value: 12.0,
                                unit: 'cm',
                            },
                            id: expect.any(String),
                            updatedAt: expect.any(Number),
                        },
                        myscopeId: expect.any(String),
                    },
                    data: {
                        createdAt: expect.any(Number),
                        createdBy: 'module',
                        id: expect.any(String),
                        updatedAt: expect.any(Number),
                        heritedDistance: {
                            value: 12.0,
                            unit: 'cm',
                        },
                        module: undefined,
                        target: expect.any(String),
                    },
                    modelAction: 'add',
                    onLocalChange: expect.any(Function),
                    scope: undefined,
                    go: false,
                },
            ],
            id: expect.any(String),
        }, {}, []);
    })
});
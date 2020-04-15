import diff from '@ohoareau/diff';
import clone from '@ohoareau/clone';
import {buildPath} from '@ohoareau/path-model';
import {v4 as uuid} from 'uuid';
import ModelService from '@ohoareau/service-model';
import {scopeAssign} from '@ohoareau/scope';

export default class SpecsService {
    private readonly modelService: ModelService;
    private readonly scopeDefinitionGetter: Function;
    constructor(modelService: ModelService, scopeDefinitionGetter: Function = () => {}) {
        this.modelService = modelService;
        this.scopeDefinitionGetter = scopeDefinitionGetter;
    }
    async load(id: string, {state}) {
        return this.modelService.load(id, undefined, {scopes: state.definition.subScopes});
    };
    async applyChanges(id, changes, model, user, setModel, scopes, callbacks = {}) {
        const changeSet = this.convertToModelChanges(changes, model, user, setModel, scopes, callbacks);
        return this.modelService.update(id, changeSet, model, scopes);
    }
    convertToModelChanges (changes, model, user, setModel, scopes, callbacks) {
        return changes.reduce((acc, change) => {
            const now = new Date().valueOf();
            const ctx = {now};
            const {actions = {}} = this.scopeDefinitionGetter(change.scope) || {};
            switch (change.action) {
                case 'new':
                    change.modelAction = 'add';
                    change.data.id = uuid();
                    scopeAssign(change.data, {createdAt: now, updatedAt: now, createdBy: user.username});
                    change = this.mergeChange(change, this.applyActions(change, actions['new'], ctx));
                    break;
                case 'edit':
                    change.modelAction = 'update';
                    change.data = diff(change.item, change.data);
                    if (change.data && 0 < Object.keys(change.data).length) {
                        change.data.updatedAt = now;
                        change.data.updatedBy = user.username;
                    }
                    change = this.mergeChange(change, this.applyActions(change, actions['edit'], ctx));
                    break;
                case 'unlock':
                    change.modelAction = 'update';
                    change.recursion = 'up';
                    change.data = {
                        updatedAt: now, updatedBy: user.username,
                        locked: false, lockUpdatedAt: now, lockVersion: undefined,
                        unlockedBy: user.username,
                        lockedBy: undefined,
                    };
                    change = this.mergeChange(change, this.applyActions(change, actions['unlock'], ctx));
                    break;
                case 'lock':
                    change.modelAction = 'update';
                    change.recursion = 'down';
                    change.data = {
                        updatedAt: now, updatedBy: user.username,
                        locked: true, lockCreatedAt: now, lockVersion: uuid(),
                        lockedBy: user.username,
                        unlockedBy: undefined,
                    };
                    change = this.mergeChange(change, this.applyActions(change, actions['lock'], ctx));
                    break;
                case 'sort':
                    change.modelAction = 'move';
                    change = this.mergeChange(change, this.applyActions(change, actions['sort'], ctx));
                    break;
                case 'clone':
                    const {count = 1, ...common} = change.data;
                    let newChanges = <any[]>[];
                    for (let i = 0; i < count; i++) {
                        const localData = {...common, ...((common.name && i > 0) ? {name: `${common.name} - ${i + 1}`} : {}),
                            createdAt: now, updatedAt: now,
                            createdBy: user.username,
                            updatedBy: user.username,
                        };
                        const {id: oldId, ...newData} = localData;
                        const {[change.scope.name]: xx, [`${change.scope.name}Id`]: xy, ...newContext} = change.context;
                        newChanges.push({
                            ...change,
                            modelAction: 'add',
                            scope: change.scope,
                            context: newContext,
                            data: {...clone(change.item), ...clone(newData)}
                        });
                    }
                    change = newChanges;
                    break;
                case 'delete':
                    change.modelAction = 'remove';
                    change.data = undefined;
                    change = this.mergeChange(change, this.applyActions(change, actions['delete'], ctx));
                    break;
                default:
                    throw new Error(`Unknown change action '${change.action}'`);
            }
            if (!Array.isArray(change)) change = [change];
            acc.changes = [
                ...acc.changes,
                ...change.map(c => Object.assign(c, {
                    onLocalChange: async (change, updatedModel, changedItem) => {
                        setModel(updatedModel);
                        callbacks.onLocalChange && await callbacks.onLocalChange(change, updatedModel, changedItem);
                    },
                }))];
            return acc;
        }, {
            id: uuid(), changes: [], callbacks: {
                onLocalChangeSetRequested: async (changeSet, response) => {
                    callbacks.onLocalChangeSetRequested && await callbacks.onLocalChangeSetRequested(changeSet, response);
                },
                onLocalChangeSetCompleted: async (changeSet, response) => {
                    callbacks.onLocalChangeSetCompleted && await callbacks.onLocalChangeSetCompleted(changeSet, response);
                },
                onRemoteChangeSetRequested: async (changeSet, response) => {
                    callbacks.onRemoteChangeSetRequested && await callbacks.onRemoteChangeSetRequested(changeSet, response);
                },
                onRemoteChangeSetCompleted: async (changeSet, response) => {
                    callbacks.onRemoteChangeSetCompleted && await callbacks.onRemoteChangeSetCompleted(changeSet, response);
                },
            }
        })
    }
    mergeChange(change, changes) {
        change = Array.isArray(change) ? change : [change];
        if (!changes || !changes.length) return change;
        return [...change, ...changes];
    }
    applyActions(change, actions = [], ctx) {
        return (!actions || !Array.isArray(actions) || !actions.length)
            ? []//(Array.isArray(change) ? change : [change])
            : actions.reduce((acc, action) => acc.concat(this.applyAction(change, action, ctx) || []), [])//[change])
            ;
    }
    applyAction(change, action, ctx) {
        switch (action.do) {
            case 'add': return this.applyAddAction(change, action, ctx);
            case 'switch': return this.applySwitchAction(change, action, ctx);
            default: return [];
        }
    }
    applyAddAction(change, {a: scope, with: data = {}, then: actions = []}, ctx) {
        const changes = <any[]>[];
        const newInfos = {
            scope: change.scope.subScopes.find(ss => ss.name === scope),
            context: {...change.context, [change.scope.name]: change.data, [`${change.scope.name}Id`]: change.data.id},
        };
        data = {...data, id: uuid(), target: `${buildPath({...change, path: change.scope.path})}.${change.data.id}`, module: change.scope.module, createdAt: ctx.now, updatedAt: ctx.now, createdBy: 'module'};
        const newChange = {
            ...newInfos,
            action: 'new',
            modelAction: 'add',
            go: false,
            data,
        };
        changes.push(newChange);
        return changes.concat(this.applyActions({...newChange, context: {...newInfos.context, [scope]: data, [`${scope}Id`]: data['id']}}, actions, ctx));
    }
    applySwitchAction(change, {on: attribute, with: cases = {}}, ctx) {
        const value = attribute.split(/\./g).reduce((acc, k) => {
            return acc[k];
        }, change.context);
        return this.applyActions(change, cases[value] || [], ctx);
    }
}
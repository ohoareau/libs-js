import diff from '@ohoareau/diff';
import clone from '@ohoareau/clone';
import {buildPath} from '@ohoareau/path-model';
import {v4 as uuid} from 'uuid';
import ModelService from '@ohoareau/service-model';
import {scopeAssign} from '@ohoareau/scope';
import {generateValues} from '@ohoareau/generate';

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
            const {actions = {}, defaultValues = {}, defaults = {}} = this.scopeDefinitionGetter(change.scope) || {};
            switch (change.action) {
                case 'new':
                    change.modelAction = 'add';
                    change.data.id = uuid();
                    scopeAssign(change.data, {createdAt: now, updatedAt: now, createdBy: user.username});
                    change.data = this.populateDefaults(change.data, defaultValues, defaults);
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
                        const cloneData = this.populateDefaults({...clone(change.item), ...clone(newData)}, defaultValues, defaults);
                        newChanges.push({
                            ...change,
                            modelAction: 'add',
                            scope: change.scope,
                            context: newContext,
                            data: cloneData,
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
        const newScope = (change.scope.subScopes || []).find(ss => ss.name === scope);
        const newInfos = {
            scope: newScope,
            context: {...change.context, [change.scope.name]: change.data, [`${change.scope.name}Id`]: change.data.id},
        };
        const newContext = {...newInfos.context, [scope]: data, [`${scope}Id`]: data['id']};
        data = this.replaceVars({...data, id: uuid(), target: `${buildPath({...change, path: change.scope.path})}.${change.data.id}`, module: change.scope.module, createdAt: ctx.now, updatedAt: ctx.now, createdBy: 'module'}, {...newContext, ...(newContext[change.scope.name] || {})});
        const {defaultValues = {}, defaults = {}} = this.scopeDefinitionGetter(newScope) || {};
        data = this.populateDefaults(data, defaultValues, defaults);
        const newChange = {
            ...newInfos,
            action: 'new',
            modelAction: 'add',
            go: false,
            data,
        };
        changes.push(newChange);
        return changes.concat(this.applyActions({...newChange, context: newContext}, actions, ctx));
    }
    applySwitchAction(change, {on: attribute, with: cases = {}}, ctx) {
        const value = attribute.split(/\./g).reduce((acc, k) => {
            return acc[k];
        }, change.context);
        return this.applyActions(change, cases[value] || [], ctx);
    }
    replaceVars(d, vars) {
        if (!d) return d;
        if (Array.isArray(d)) return d.map(v => this.replaceVars(v, vars));
        if ('object' === typeof d) return Object.entries(d).reduce((acc, [k, v]) => {
            acc[k] = this.replaceVars(v, vars);
            return acc;
        }, {});
        if ('string' === typeof d) {
            if (('{{' === d.slice(0, 2)) && ('}}' === d.slice(d.length - 2))) {
                return require('object-path').get(vars, d.slice(2, d.length - 2));
            }
            return d;
        }
        return d;
    }
    populateDefaults(data, defaultValues, defaults): any {
        return {
            ...generateValues(defaults, {}),
            ...((defaultValues || {})['*'] || {}),
            ...(Object.entries(defaultValues || {}).reduce((acc, [k, v]) => {
                if (!data[k]) return acc;
                if (('string' !== typeof data[k]) || !(v as any)[data[k]]) return acc;
                return {...(v as any)[data[k]], ...acc};
            }, {})),
            ...data,
        };
    }
}
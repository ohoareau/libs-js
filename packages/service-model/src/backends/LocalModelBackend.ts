import {buildPath} from '@ohoareau/path-model';
import {v4 as uuid} from 'uuid';
import BackendInterface from '../BackendInterface';
import * as modelActions from '@ohoareau/path-model';

const updateIndexesAfterChange = (change, updatedModel, changedItem) => {
    if (!change.scope.indexes) return updatedModel;
    Object.entries(change.scope.indexes).forEach(([k, def]) => {
        def = {name: k, ...(def as any)};
        const key = `${change.scope.module}_${change.scope.name}`;
        const n = (<any>def).name;
        switch (change.modelAction) {
            case 'add':
            case 'update':
                updatedModel._indexes = updatedModel._indexes || {};
                updatedModel._indexes[key] = updatedModel._indexes[key] || {};
                updatedModel._indexes[key][n] = updatedModel._indexes[key][n] || {version: undefined, items: {}};
                updatedModel._indexes[key][n].items[changedItem[n]] = changedItem;
                updatedModel._indexes[key][n].version = uuid();
                changedItem._scopePath = buildPath({...change, path: change.scope.path});
                changedItem._scopeModule = change.scope.module;
                break;
            case 'remove':
                const removedItem = change.item;
                updatedModel._indexes && updatedModel._indexes[key] && updatedModel._indexes[key][n] && updatedModel._indexes[key][n].items && updatedModel._indexes[key][n].items[removedItem[n]] && (delete updatedModel._indexes[key][n].items[removedItem[n]]);
                updatedModel._indexes && updatedModel._indexes[key] && updatedModel._indexes[key][n] && (0 === Object.keys(updatedModel._indexes[key][n].items).length) && (delete updatedModel._indexes[key][n]);
                updatedModel._indexes && updatedModel._indexes[key] && (0 === Object.keys(updatedModel._indexes[key]).length) && (delete updatedModel._indexes[key]);
                break;
            default:
                break;
        }
    });
    return updatedModel;
};

export default class LocalModelBackend implements BackendInterface {
    private localStorage: any;
    private cacheKeyPrefix: string = 'localModel';
    constructor(localStorage: any, cacheKeyPrefix: string) {
        this.setLocalStorage(localStorage);
        this.setCacheKeyPrefix(cacheKeyPrefix);
    }
    setLocalStorage(localStorage) {
        this.localStorage = localStorage;
        return this;
    }
    setCacheKeyPrefix(cacheKeyPrefix: string) {
        this.cacheKeyPrefix = cacheKeyPrefix;
        return this;
    }
    getLocalStorage() {
        return this.localStorage;
    }
    getCacheKeyPrefix(): string {
        return this.cacheKeyPrefix;
    }
    async update(id: string, changeSet: any, model: any, scopes: any): Promise<any> {
        (changeSet.callbacks && changeSet.callbacks['onLocalChangeSetRequested']) && await changeSet.callbacks['onLocalChangeSetRequested'](changeSet, {previousModel: model});
        const r = await Promise.all((changeSet.changes || []).map(async change => this.applyChange(change, model)));
        (changeSet.callbacks && changeSet.callbacks['onLocalChangeSetCompleted']) && await changeSet.callbacks['onLocalChangeSetCompleted'](changeSet, {result: r, previousModel: model});
        await this.save(id, model, {scopes, rebuildIndexes: false});
    }
    // noinspection JSMethodCanBeStatic
    private async applyChange(change: any, model: any): Promise<any> {
        const {scope, context, item, data, modelAction, onLocalChange, ...extra} = change;
        if (!modelActions[modelAction]) throw new Error(`Unknown local model change action '${modelAction}'`);
        const r = modelActions[modelAction](
            {model, path: scope.path, context, id: item ? item.id : undefined, data, ...extra}
        );
        const updatedModel = {...model};
        const changedItem = r;
        updateIndexesAfterChange(change, updatedModel, changedItem);
        return onLocalChange ? onLocalChange(change, updatedModel, changedItem) : {change, model: updatedModel, item: changedItem};
    }
    async load(id: string, ctx?: any): Promise<any> {
        const model = this.unmarshall(this.getLocalStorage().getItem(this.getCacheKey(id)));
        if (!!model && !model._indexes) this.buildIndexes(model, ctx);
        return model;
    }
    async save(id: string, model: any, ctx?: any): Promise<any> {
        ctx && (!ctx.hasOwnProperty('rebuildIndexes') || ctx.rebuildIndexes) && this.buildIndexes(model, ctx);
        this.getLocalStorage().setItem(this.getCacheKey(id), this.marshall(model) as string);
        return model;
    }
    private getCacheKey(id: string): string {
        return `${this.getCacheKeyPrefix()}::${id}`;
    }
    // noinspection JSMethodCanBeStatic
    private unmarshall(value: string|undefined): any {
        return value ? JSON.parse(value) : undefined;
    }
    // noinspection JSMethodCanBeStatic
    private marshall(value: any): string|undefined {
        return value ? JSON.stringify(value) : undefined;
    }
    private buildIndexes(model: any, ctx: any): void {
        if (!ctx.scopes || !ctx.scopes.length) return;
        ctx.scopes.forEach(s => this.rebuildScopeIndexes(model, s, model[`${s.name}s`] || []));
    }
    private rebuildScopeIndexes(model: any, scope: any, items: any): void {
        if (!items || !items.length) return;
        const toIndex = !!scope.indexes;
        const key = `${scope.module}_${scope.name}`;
        model._indexes = model._indexes || (toIndex ? {} : undefined);
        toIndex && (model._indexes[key] = model._indexes[key] || (toIndex ? {} : undefined));
        let def;
        toIndex && Object.entries(scope.indexes).forEach(([k, v]) => {
            def = {name: k, ...(<any>v)};
            toIndex && (model._indexes[key][def.name] = {version: uuid(), items: {}});
        });
        items.forEach(item => {
            toIndex && (model._indexes[key][def.name].items[item[def.name]] = item);
            (scope.subScopes && !!scope.subScopes.length) && scope.subScopes.forEach(ss => this.rebuildScopeIndexes(model, ss, item[`${ss.name}s`] || []));
        });
    }
}
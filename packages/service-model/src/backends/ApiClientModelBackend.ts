import {buildPath} from '@ohoareau/path-model';

export type ClientType = {
    mutate: Function,
    query: Function,
};

export default class ApiClientModelBackend {
    private client: any;
    private getProjectSpecsQuery: any;
    private applyProjectChangeSetMutation: any;
    constructor(client: ClientType, getProjectSpecsQuery: any, applyProjectChangeSetMutation: any) {
        this.setClient(client);
        this.setGetProjectSpecsQuery(getProjectSpecsQuery);
        this.setApplyProjectChangeSetMutation(applyProjectChangeSetMutation);
    }
    setClient(client: ClientType) {
        this.client = client;
        return this;
    }
    setGetProjectSpecsQuery(getProjectSpecsQuery: any) {
        this.getProjectSpecsQuery = getProjectSpecsQuery;
        return this;
    }
    setApplyProjectChangeSetMutation(applyProjectChangeSetMutation: any) {
        this.applyProjectChangeSetMutation = applyProjectChangeSetMutation;
        return this;
    }
    getClient(): ClientType {
        return this.client;
    }
    getGetProjectSpecsQuery(): any {
        return this.getProjectSpecsQuery;
    }
    getApplyProjectChangeSetMutation(): any {
        return this.applyProjectChangeSetMutation;
    }
    async update(id: string, changeSet: any, model: any): Promise<any> {
        try {
            const changes = this.mutateChanges(changeSet.changes || []);
            const r = await this.getClient().mutate({
                mutation: this.getApplyProjectChangeSetMutation(), variables: {
                    pr: id,
                    c: changes,
                }
            });
            (changeSet.callbacks && changeSet.callbacks['onRemoteChangeSetRequested']) && await changeSet.callbacks['onRemoteChangeSetRequested'](changeSet, {result: r, previousModel: model});
        } catch (e) {
            console.log(e);
        }
    }
    private mutateChanges(changes: any[]): any[] {
        return changes.reduce((acc, c) => {
            const cc = {pa: this.buildPath({...c, path: c.scope.path}), o: this.buildOperation(c)};
            const [d, x] = this.buildData(c.data, cc);
            acc.push(Object.assign(cc, {d}));
            !!x.length && acc.push(...x);
            return acc;
        }, []);
    }
    async load(id: string): Promise<any> {
        try {
            const d = await this.getClient().query({
                query: this.getGetProjectSpecsQuery(), variables: {
                    pr: id,
                },
                fetchPolicy: 'network-only',
            });
            const r = (d && d.data && d.data.ps && d.data.ps.s) ? JSON.parse(d.data.ps.s) : undefined;
            return r ? {projects: [{id, ...r}]} : undefined;
        } catch (e) {
            return undefined;
        }
    }
    // noinspection JSUnusedLocalSymbols
    async save(id: string, model: any, scopes: any): Promise<any> {
        return Promise.resolve(model);
    }
    // noinspection JSMethodCanBeStatic
    private buildPath(change: any): string {
        let p = buildPath({...change, id: (change.item && change.item.id) ? change.item.id : undefined, path: change.scope.path});
        if ('add' === change.modelAction) {
            p = `${p}.${change.data.id}`;
        }
        return p.replace(/^projects\.[^.]+\./, '');
    }
    private buildData(data: any, parent: any): [any[], any[]] {
        return Object.entries(data || {}).reduce((acc, [k, v]) => {
            if (!Array.isArray(v)) {
                acc[0].push({k, ...this.marshallValue(v, k),});
                return acc;
            }
            v.forEach(vv => {
                const child = {...parent, pa: `${parent.pa}.${k}.${vv.id}`};
                const [d, x] = this.buildData(vv, child);
                acc[1].push({...child, d});
                !!x.length && acc[1].push(...x);
            });
            return acc;
        }, [<any[]>[], <any[]>[]]);
    }
    // noinspection JSMethodCanBeStatic
    private buildOperation(change: any): string {
        switch (change.modelAction) {
            case 'add': return 'A';
            case 'update': return 'U';
            case 'remove': return 'R';
            case 'move': return 'M';
            default: throw new Error(`Unknown model operation '${change.modelAction}'`);
        }
    }
    private marshallValue(v: any, k: string): {[key: string]: any} {
        if (/At$/.test(k)) v = `${v}`;
        const t = typeof v;
        switch (true) {
            case 'string' === t: return {s: v};
            case 'boolean' === t: return {b: v};
            case 'undefined' === t: return {n: true};
            case 'number' === t: return Number.isInteger(v) ? {i: v} : {f: v};
            case 'object' === t: return {o: Object.entries(v).map(([kk, vv]) => ({k: kk, ...this.marshallValue(vv, kk)}))};
            default: return {s: `${v}`};
        }
    }
}
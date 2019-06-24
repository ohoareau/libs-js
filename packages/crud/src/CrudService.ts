import IBackend from './IBackend';
import IExecutor from './IExecutor';
import MemoryBackend from './backends/memory/Backend';
import Page from './Page';
import Rule from './Rule';
import OperationNotSupportedBackendError from './errors/OperationNotSupportedBackendError';
import DefaultExecutor from "./DefaultExecutor";
import RuleService from "./RuleService";
import Context from "./Context";

export default class CrudService<M = object> {
    private readonly name: string;
    private rules: Rule[];
    private contextualRules: object;
    private backend: IBackend;
    private executor: IExecutor;
    private ruleService: RuleService;
    public constructor(name: string, backend: IBackend|undefined = undefined, rules: object = {}, contextualRules: object = {}, executor: IExecutor|undefined = undefined, ruleService: RuleService|undefined = undefined) {
        this.name = name;
        this.rules = [];
        this.contextualRules = {};
        this.setContextualRules(contextualRules);
        this.backend = backend || new MemoryBackend();
        this.executor = executor || new DefaultExecutor();
        this.ruleService = ruleService || new RuleService();
        this.setRawRules(rules);
    }
    public getName(): string {
        return this.name;
    }
    public setContextualRules(rules: object): this {
        this.contextualRules = rules;
        return this;
    }
    public setRawRules(rules: object): this {
        return this.setRules(this.ruleService.convert(rules));
    }
    public setRules(rules: Rule[]): this {
        this.rules = rules;
        return this;
    }
    public getRules(): Rule[] {
        return this.rules;
    }
    public getBackend(): IBackend {
        return this.backend;
    }
    public setBackend(backend: IBackend): this {
        this.backend = backend;
        return this;
    }
    protected async processCreate(data: object, options: object = {}): Promise<M> {
        const [opts, ctx, payload] = this.prepare(['#write', '@create', 'created'], options, {data});
        return this.executor.execute(
            ctx,
            await this.preSelectRules(ctx),
            async () => this.executeBackendOperation('create', payload, opts)
        );
    }
    protected async processUpdate(id: string, data: object, options: object = {}): Promise<M> {
        const [opts, ctx, payload] = this.prepare(['#write', '@update', 'updated'], options, {id, data});
        return this.executor.execute(
            ctx,
            await this.preSelectRules(ctx),
            async () => this.executeBackendOperation('update', payload, opts),
            async () => ({old: await this.processGet(id, [], {...options, noPreAuthorize: true, noAuthorize: true})})
        );
    }
    protected async processGet(id: string, fields: string[] = [], options: object = {}): Promise<M> {
        const [opts, ctx, payload] = this.prepare(['#read', '@get'], options, {id, fields});
        return this.executor.execute(
            ctx,
            await this.preSelectRules(ctx),
            async () => this.executeBackendOperation('get', payload, opts)
        );
    }
    protected async processRemove(id: string, options: object = {}): Promise<M> {
        const [opts, ctx, payload] = this.prepare(['#write', '@remove', 'removed'], options, {id});
        return this.executor.execute(
            ctx,
            await this.preSelectRules(ctx),
            async () => this.executeBackendOperation('remove', payload, opts),
            async () => ({old: await this.processGet(id, [], {...options, noPreAuthorize: true, noAuthorize: true})})
        );
    }
    protected async processFind(criteria: object = {}, fields: string[] = [], limit: number|undefined = undefined, sort: object|undefined = undefined, nextToken: string|undefined = undefined, options: object = {}): Promise<Page<M>> {
        const [opts, ctx, payload] = this.prepare(['#read', '@find'], options, {criteria, fields, limit, sort, nextToken});
        return this.executor.execute(
            ctx,
            await this.preSelectRules(ctx),
            async () => this.executeBackendOperation('find', payload, opts)
        );
    }
    protected async processFindOne(criteria: object = {}, fields: string[] = [], options: object = {}): Promise<M|undefined> {
        const page = await this.processFind(
            criteria,
            fields,
            1,
            undefined,
            undefined,
            this.prepare(['findOne'], options)[0]
        );
        return (!page || !page.items || page.items.length < 1) ? undefined : page.items[0];
    }
    protected async processSet(id: string, key: string, value: any, options: object = {}): Promise<M> {
        return this.processUpdate(id, {[key]: value}, this.prepare(['set'], options)[0]);
    }
    protected async processSetStatus(id: string, value: any, options: object = {}): Promise<M> {
        return this.processSet(id, 'status', value, this.prepare(['status', value], options)[0]);
    }
    protected async processSuspend(id: string, options: object = {}): Promise<M> {
        return this.processSet(id, 'suspended', true, this.prepare(['suspend', 'suspended'], options)[0]);
    }
    protected async processUnsuspend(id: string, options: object = {}): Promise<M> {
        return this.processSet(id, 'suspended', false, this.prepare(['unsuspend', 'unsuspended'], options)[0]);
    }
    protected async processList(fields: string[], limit: number|undefined = undefined, sort: object|undefined = undefined, nextToken: string|undefined = undefined, options: object = {}): Promise<Page<M>> {
        return this.processFind({}, fields, limit, sort, nextToken, this.prepare(['list', 'listed'], options)[0]);
    }
    protected prepare(operations: string[], options: object|undefined, payload: any = {}): [object, Context, object] {
        options = options || {};
        options = {caller: undefined, ...options, operations: operations.concat((<{operations?: any}>options).operations || []), service: this.getName()};
        return [options, new Context({...payload, ...options}), payload];
    }
    protected async executeBackendOperation(operation: string, data: any, options: object): Promise<any> {
        if (!this.getBackend().supports(operation)) {
            throw new OperationNotSupportedBackendError(this.getBackend().getName(), operation);
        }
        return this.getBackend().execute(operation, data, options);
    }
    protected async preSelectRules(ctx: Context): Promise<Rule[]> {
        return (await Promise.all(Object.keys(this.contextualRules || {}).map(async (k) => {
            const v = ctx.get(k, undefined);
            let acc = <Rule[]>[];
            if (v && this.contextualRules[k][v]) {
                const rr = this.contextualRules[k][v];
                acc = this.ruleService.convert('function' === typeof rr ? await rr() : rr);
            }
            return acc;
        }))).reduce((acc, rr) => (<Rule[]>[]).concat(acc, rr), this.rules);
    }
}
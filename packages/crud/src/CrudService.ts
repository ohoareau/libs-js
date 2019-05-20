import IBackend from './IBackend';
import IExecutor from './IExecutor';
import MemoryBackend from './backends/memory/Backend';
import Page from './Page';
import Rule from './Rule';
import OperationNotSupportedBackendError from './errors/OperationNotSupportedBackendError';
import DefaultExecutor from "./DefaultExecutor";
import RuleService from "./RuleService";

export default class CrudService<M = object> {
    private rules: Rule[];
    private backend: IBackend;
    private executor: IExecutor;
    private ruleService: RuleService;
    public constructor(backend: IBackend|undefined = undefined, rules: object = {}, executor: IExecutor|undefined = undefined, ruleService: RuleService|undefined = undefined) {
        this.rules = [];
        this.backend = backend || new MemoryBackend();
        this.executor = executor || new DefaultExecutor();
        this.ruleService = ruleService || new RuleService();
        this.setRawRules(rules);
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
        const [opts, operations, caller] = this.optize(['@create', 'created'], options);
        return this.executor.execute(
            this.rules,
            {data, caller},
            operations,
            async () => this.executeBackendOperation('create', {data}, opts)
        );
    }
    protected async processUpdate(id: string, data: object, options: object = {}): Promise<M> {
        const [opts, operations, caller] = this.optize(['@update', 'updated'], options);
        return this.executor.execute(
            this.rules,
            {id, data, caller},
            operations,
            async () => this.executeBackendOperation('update', {id, data}, opts),
            async () => ({old: await this.processGet(id, [], options)})
        );
    }
    protected async processGet(id: string, fields: string[] = [], options: object = {}): Promise<M> {
        const [opts, operations, caller] = this.optize(['@get'], options);
        return this.executor.execute(
            this.rules,
            {id, fields, caller},
            operations,
            async () => this.executeBackendOperation('get', {id, fields}, opts),
            undefined
        );
    }
    protected async processRemove(id: string, options: object = {}): Promise<M> {
        const [opts, operations, caller] = this.optize(['@remove', 'removed'], options);
        return this.executor.execute(
            this.rules,
            {id, caller},
            operations,
            async () => this.executeBackendOperation('remove', {id}, opts),
            async () => ({old: await this.processGet(id, [], options)})
        );
    }
    protected async processFind(criteria: object = {}, fields: string[] = [], limit: number|undefined = undefined, sort: object|undefined = undefined, nextToken: string|undefined = undefined, options: object = {}): Promise<Page<M>> {
        const [opts, operations, caller] = this.optize(['@find'], options);
        return this.executor.execute(
            this.rules,
            {criteria, fields, limit, sort, nextToken, caller},
            operations,
            async () => this.executeBackendOperation('find', {criteria, fields, limit, sort, nextToken}, opts)
        );
    }
    protected async processFindOne(criteria: object = {}, fields: string[] = [], options: object = {}): Promise<M|undefined> {
        const page = await this.processFind(
            criteria,
            fields,
            1,
            undefined,
            undefined,
            this.optize(['findOne'], options)[0]
        );
        if (!page || !page.items || page.items.length < 1) {
            return undefined;
        }
        return page.items[0];
    }
    protected async processSet(id: string, key: string, value: any, options: object = {}): Promise<M> {
        return this.processUpdate(id, {[key]: value}, this.optize(['set'], options)[0]);
    }
    protected async processSetStatus(id: string, value: any, options: object = {}): Promise<M> {
        return this.processSet(id, 'status', value, this.optize(['status', value], options)[0]);
    }
    protected async processSuspend(id: string, options: object = {}): Promise<M> {
        return this.processSet(id, 'suspended', true, this.optize(['suspend', 'suspended'], options)[0]);
    }
    protected async processUnsuspend(id: string, options: object = {}): Promise<M> {
        return this.processSet(id, 'suspended', false, this.optize(['unsuspend', 'unsuspended'], options)[0]);
    }
    protected async processList(fields: string[], limit: number|undefined = undefined, sort: object|undefined = undefined, nextToken: string|undefined = undefined, options: object = {}): Promise<Page<M>> {
        return this.processFind({}, fields, limit, sort, nextToken, this.optize(['list', 'listed'], options)[0]);
    }
    protected optize(operations: string[], options: object|undefined): [object, string[], object] {
        options = options || {};
        options = {caller: undefined, ...options, operations: operations.concat((<{operations?: any}>options).operations || [])};
        return [options, (<{operations?: any}>options).operations, (<{caller?: any}>options).caller];
    }
    protected async executeBackendOperation(operation: string, data: any, options: object): Promise<any> {
        if (!this.getBackend().supports(operation)) {
            throw new OperationNotSupportedBackendError(this.getBackend().getName(), operation);
        }
        return this.getBackend().execute(operation, data, options);
    }
}
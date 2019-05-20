import Context from "./Context";
import Rule from "./Rule";
import BulkError from "./errors/BulkError";
import IExecutor from "./IExecutor";

export default class DefaultExecutor implements IExecutor {
    public async execute(rules: Rule[], data: object, operations: string[], action: Function, prePopulate: Function|undefined = undefined, ctx: Context|undefined = undefined): Promise<any> {
        ctx = ctx || new Context();
        const plgs = {};
        ctx.setMultiple({...data, plugins: plgs});
        let preExecuteExecuted = false;
        const preExecuteOnce = (i: number): ((ctx: Context, execCtx: Context) => any)|undefined => {
            if (preExecuteExecuted) {
                return undefined;
            }
            if (!prePopulate) {
                preExecuteExecuted = true;
                return undefined;
            }
            if (0 !== i) {
                return undefined;
            }
            return async (ctx: Context, execCtx: Context) => {
                preExecuteExecuted = true;
                return ctx.setMultiple(await prePopulate());
            }
        };
        const rlz = this.splitRules(rules);
        try {
            plgs['prepare'] = await this.hook(rlz['prepare'], operations, ctx, 'prepare', preExecuteOnce);
            plgs['preAuthorize'] = await this.hook(rlz['preAuthorize'], operations, ctx, 'preAuthorize', preExecuteOnce);
            plgs['validate'] = await this.hook(rlz['validate'], operations, ctx, 'validate', preExecuteOnce, false);
            plgs['fetch'] = await this.hook(rlz['fetch'], operations, ctx, 'fetch', preExecuteOnce, false);
            plgs['authorize'] = await this.hook(rlz['authorize'], operations, ctx, 'authorize', preExecuteOnce);
            plgs['before'] = await this.hook(rlz['before'], operations, ctx, 'before', preExecuteOnce);
            ctx.set('result', await action());
            plgs['result'] = await this.hook(rlz['result'], operations, ctx, 'result', preExecuteOnce);
            plgs['after'] = await this.hook(rlz['after'], operations, ctx, 'after', preExecuteOnce);
            plgs['log'] = await this.hook(rlz['log'], operations, ctx, 'log', preExecuteOnce, false);
            plgs['publish'] = await this.hook(rlz['publish'], operations, ctx, 'publish', preExecuteOnce);
            plgs['notify'] = await this.hook(rlz['notify'], operations, ctx, 'notify', preExecuteOnce);
            plgs['clean'] = await this.hook(rlz['clean'], operations, ctx, 'clean', preExecuteOnce, false);
        } catch (e) {
            ctx.set('error', e);
            try {
                plgs['error'] = await this.hook(rlz['error'], operations, ctx, 'error');
                plgs['errorNotify'] = await this.hook(rlz['errorNotify'], operations, ctx, 'errorNotify', undefined, false);
            } catch (ee) {
                ctx.set('error', ee);
                plgs['errorNotify'] = await this.hook(rlz['errorNotify'], operations, ctx, 'errorNotify', undefined, false);
                throw ee;
            }
        }
        const error = ctx.get('error', undefined);
        if (error) {
            throw error;
        }
        return ctx.get('result');
    }
    protected splitRules(rules: Rule[]): {[k: string]: Rule[]} {
        return rules.reduce((acc, r: Rule) => Object.keys(r.getTypes()).reduce((acc2, t) => {
            if (!acc2[t]) {
                acc2[t] = [];
            }
            acc2[t].push(r);
            return acc2;
        }, acc)
        , <{[k: string]: Rule[]}>{});
    }
    protected async hook(rules: Rule[], operations: string[], ctx: Context, step: string, preExecuteOnce: Function|undefined = undefined, stopOnError: boolean = true): Promise<number> {
        if (!operations || !operations.length || !rules || !rules.length) {
            return 0;
        }
        return (await Promise.all(operations.map((o, i) => this.process(rules, ctx, o, step, preExecuteOnce ? preExecuteOnce(i) : undefined, stopOnError)))).reduce((a, b) => a + b);
    }
    protected async process(rules: Rule[], ctx: Context|undefined, operation: string, type: string, preExecute: Function|undefined = undefined, stopOnError: boolean = true): Promise<number> {
        ctx = ctx || new Context();
        const execCtx = new Context({operation, type, isCoreOperation: operation && ('@' === operation.substr(0, 1))});
        rules = this.filter(rules, ctx, execCtx);
        if (!rules.length) {
            return 0;
        }
        try {
            if (preExecute) {
                await preExecute(ctx, execCtx);
            }
            if (!ctx) {
                rules = [];
            } else {
                if (stopOnError) {
                    await rules.reduce((acc, rule: Rule) => acc.then(() => rule.execute(<Context>ctx, execCtx)), Promise.resolve());
                } else {
                    const errors: Error[] = <Error[]><unknown>(await Promise.all(rules.map(async (rule: Rule) => {
                        let error = undefined;
                        try {
                            await rule.execute(<Context>ctx, execCtx);
                        } catch (e) {
                            error = e;
                        }
                        return error;
                    }))).filter(e => !!e);
                    if (errors.length) {
                        throw new BulkError(errors);
                    }
                }
            }
        } catch (e) {
            if ((e instanceof BulkError) && (e.getErrors().length === 1)) {
                throw e.getErrors()[0];
            }
            throw e;
        }
        return rules.length;
    }
    protected filter(rules: Rule[], ctx: Context, execCtx: Context): Rule[] {
        return rules.filter((rule: object) => (<Rule>rule).isValid(ctx, execCtx)) as Rule[];
    }
}

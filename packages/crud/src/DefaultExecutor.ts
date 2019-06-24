import Context from "./Context";
import Rule from "./Rule";
import BulkError from "./errors/BulkError";
import IExecutor from "./IExecutor";

export default class DefaultExecutor implements IExecutor {
    public async execute(ctx: Context, rules: Rule[], action: Function, prePopulate: Function|undefined = undefined): Promise<any> {
        ctx.set('plugins', {});
        let preExecuteExecuted = false;
        const preExecuteOnce = (): ((ctx: Context, execCtx: Context) => any)|undefined => {
            if (preExecuteExecuted) {
                return undefined;
            }
            if (!prePopulate) {
                preExecuteExecuted = true;
                return undefined;
            }
            return async (ctx: Context) => {
                preExecuteExecuted = true;
                ctx.setMultiple(await prePopulate());
            };
        };
        const rlz = rules.reduce((acc, r: Rule) => Object.keys(r.getTypes()).reduce((acc2, t) => {
                if (!acc2[t]) {
                    acc2[t] = [];
                }
                acc2[t].push(r);
                return acc2;
            }, acc)
            , <{[k: string]: Rule[]}>{});
        try {
            await this.hook(ctx, 'prepare', rlz, preExecuteOnce);
            await this.hook(ctx, 'preAuthorize', rlz, preExecuteOnce);
            await this.hook(ctx, 'validate', rlz, preExecuteOnce, false);
            await this.hook(ctx, 'fetch', rlz, preExecuteOnce, false);
            await this.hook(ctx, 'authorize', rlz, preExecuteOnce);
            await this.hook(ctx, 'before', rlz, preExecuteOnce);
            ctx.set('result', await action());
            await this.hook(ctx, 'result', rlz, preExecuteOnce);
            await this.hook(ctx, 'after', rlz, preExecuteOnce);
            await this.hook(ctx, 'log', rlz, preExecuteOnce, false);
            await this.hook(ctx, 'publish', rlz, preExecuteOnce);
            await this.hook(ctx, 'notify', rlz, preExecuteOnce);
            await this.hook(ctx, 'clean', rlz, preExecuteOnce, false);
        } catch (e) {
            ctx.set('error', e);
            try {
                await this.hook(ctx, 'error', rlz);
                await this.hook(ctx, 'errorNotify', rlz, undefined, false);
            } catch (ee) {
                ctx.set('error', ee);
                await this.hook(ctx, 'errorNotify', rlz, undefined, false);
                throw ee;
            }
        }
        const error = ctx.get('error', undefined);
        if (error) {
            throw error;
        }
        return ctx.get('result');
    }
    protected async hook(ctx, type, rules: {[k: string]: Rule[]}, preExecuteOnce: Function|undefined = undefined, stopOnError: boolean = true): Promise<void> {
        const plugins = ctx.get('plugins');
        if (ctx.enabled(`no${type.substr(0, 1).toUpperCase()}${type.substr(1)}`)) {
            return;
        }
        const operations: string[] = ctx.get('operations', []);
        let n = 0;
        if (operations && operations.length && rules && rules[type] && rules[type].length) {
            n = (await Promise.all(operations.map(async (o, i) => {
                const execCtx = new Context({operation: o, type, isCoreOperation: o && ('@' === o.substr(0, 1)), isReadWriteOperation: o && ('#' === o.substr(0, 1))});
                let filteredRules = rules[type].filter((rule: object) => (<Rule>rule).isValid(ctx, execCtx));
                if (!filteredRules.length) {
                    return 0;
                }
                try {
                    const preExecute = preExecuteOnce ? preExecuteOnce(i) : undefined;
                    if (preExecute) {
                        await preExecute(ctx, execCtx);
                    }
                    if (!ctx) {
                        filteredRules = [];
                    } else {
                        if (stopOnError) {
                            await filteredRules.reduce((acc, rule: Rule) => acc.then(() => rule.execute(<Context>ctx, execCtx)), Promise.resolve());
                        } else {
                            const errors: Error[] = <Error[]><unknown>(await Promise.all(filteredRules.map(async (rule: Rule) => {
                                let error = undefined;
                                try {
                                    await rule.execute(<Context>ctx, execCtx);
                                } catch (e) {
                                    error = e;
                                }
                                return error;
                            }))).filter(e => !!e);
                            if (errors.length) {
                                // noinspection ExceptionCaughtLocallyJS
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
                return filteredRules.length;
            }))).reduce((a, b) => a + b);
        }
        plugins[type] = n;
    }
}
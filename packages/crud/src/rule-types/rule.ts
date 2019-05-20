import Context from '../Context';

export type ruleType = {
    operations: string[]|string|undefined,
    types: string[]|string|undefined,
    title: string,
    handler: (ctx: Context, execCtx: Context) => any,
    condition: ((ctx: Context, execCtx: Context) => boolean)|undefined,
};

export const rule = (
    operations: string[]|string|undefined,
    types: string[]|string|undefined,
    title: string,
    handler: (ctx: Context, execCtx: Context) => any,
    condition: ((ctx: Context, execCtx: Context) => boolean)|undefined = undefined
): ruleType => (<ruleType>{
    operations,
    types,
    title,
    handler: async (ctx: Context, execCtx: Context) => handler(ctx, execCtx),
    condition,
});
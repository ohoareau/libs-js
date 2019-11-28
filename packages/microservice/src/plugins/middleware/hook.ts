import {Map, Config, normalizeDefinition} from '../..';

const hooked = async (ctx, name: string, action: Map, awaitResult = false) => {
    const hks = ctx.config.hooks;
    if (!hks || !hks[name]) return;
    if (awaitResult) action.res.result = await (await action).res.result;
    await applyHooks(hks[name], ctx, action);
};

export default (ctx: {config: Config}) => next => async action => {
    await hooked(ctx, `validate_${action.req.operation}`, action);
    await hooked(ctx, `populate_${action.req.operation}`, action);
    await hooked(ctx, `before_${action.req.operation}`, action);
    await hooked(ctx, `prepare_${action.req.operation}`, action);
    const result = await next(action);
    await hooked(ctx, action.req.operation, result, true);
    await hooked(ctx, `after_${action.req.operation}`, result, true);
    await hooked(ctx, `notify_${action.req.operation}`, result, true);
    await hooked(ctx, `clean_${action.req.operation}`, result, true);
    return result;
};

export const applyHooks = async (hooks: any[]|any, ctx: {config: Config}, action: Map): Promise<any> =>
    await (Array.isArray(hooks) ? hooks : [hooks]).reduce(async (acc, h) => {
        await acc;
        return ctx.config.createHook(
            ('function' === typeof h) ? {type: 'callback', config: {callback: h}} : normalizeDefinition(h), ctx.config
        )(action, ctx);
    }, Promise.resolve())
;
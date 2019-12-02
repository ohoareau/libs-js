import {Map, Config, normalizeDefinition} from '../..';

const hooked = async (ctx, name: string, action: Map, awaitResult = false) => {
    const hks = ctx.config.hooks;
    if (!hks || !hks[name]) return;
    if (awaitResult) action.res.result = await action.res.result;
    const hooks = (Array.isArray(hks) ? hks : [hks]);
    ctx.config.log('hook', name, 'BEFORE', hooks.length, 'hooks', action.req.payload, action.res.result);
    await applyHooks(hks[name], ctx, action);
    ctx.config.log('hook', name, 'AFTER', hooks.length, 'hooks', action.req.payload, action.res.result);
};

export default (ctx: {config: Config}) => next => async action => {
    await hooked(ctx, `validate_${action.req.operation}`, action);
    await hooked(ctx, `populate_${action.req.operation}`, action);
    await hooked(ctx, `transform_${action.req.operation}`, action);
    await hooked(ctx, `before_${action.req.operation}`, action);
    await hooked(ctx, `prepare_${action.req.operation}`, action);
    const result = await next(action);
    await hooked(ctx, action.req.operation, result, true);
    await hooked(ctx, `after_${action.req.operation}`, result, true);
    await hooked(ctx, `notify_${action.req.operation}`, result, true);
    await hooked(ctx, `clean_${action.req.operation}`, result, true);
    return result;
};

export const applyHooks = async (hooks: any[], ctx: {config: Config}, action: Map): Promise<any> =>
    await hooks.reduce(async (acc, h) => {
        await acc;
        const def = ('function' === typeof h) ? {type: 'callback', config: {callback: h}} : normalizeDefinition(h);
        if (def.trackData && Array.isArray(def.trackData) && (0 < def.trackData.length)) {
            const data = ((await action).req.payload || {}).data || {};
            if (0 === def.trackData.filter(f => data.hasOwnProperty(f)).length) {
               return Promise.resolve();
            }
        }
        return ctx.config.createHook(def, ctx.config)(action, ctx);
    }, Promise.resolve())
;
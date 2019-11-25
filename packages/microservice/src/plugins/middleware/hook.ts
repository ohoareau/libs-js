import {Map, Config, normalizeDefinition} from '../..';

export default (ctx: {config: Config}) => next => async action => {
    if (ctx.config.hooks && ctx.config.hooks[`validate_${action.req.operation}`]) {
        await applyHooks(ctx.config.hooks[`validate_${action.req.operation}`], ctx, action);
    }
    if (ctx.config.hooks && ctx.config.hooks[`populate_${action.req.operation}`]) {
        await applyHooks(ctx.config.hooks[`populate_${action.req.operation}`], ctx, action);
    }
    if (ctx.config.hooks && ctx.config.hooks[`before_${action.req.operation}`]) {
        await applyHooks(ctx.config.hooks[`before_${action.req.operation}`], ctx, action);
    }
    const r = await next(action);
    if (ctx.config.hooks && ctx.config.hooks[action.req.operation]) {
        r.res.result = await r.res.result;
        await applyHooks(ctx.config.hooks[action.req.operation], ctx, action);
    }
    return r;
};

export const applyHooks = async (hooks: any[]|any, ctx: {config: Config}, action: Map): Promise<any> =>
    await (Array.isArray(hooks) ? hooks : [hooks]).reduce(async (acc, h) => {
        await acc;
        return ctx.config.createHook(
            ('function' === typeof h) ? {type: 'callback', config: {callback: h}} : normalizeDefinition(h), ctx.config
        )(action);
    }, Promise.resolve())
;
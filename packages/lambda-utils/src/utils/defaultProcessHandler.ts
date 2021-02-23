import * as defaultActions from "../actions";
import {ctx, route} from '../types';

export async function defaultProcessHandler(ctx: ctx) {
    const actions = {...defaultActions, ...(ctx.config?.actions || {})};
    const route: route|undefined = ctx.request.route;
    const action = actions[route?.type || ctx.request.route?.name || ctx.config?.defaultRouteType || 'default'] || actions[ctx.config?.defaultRouteType || 'default'];
    if (!action) return ctx.helpers.httpNotFound();
    const rawResponse = await action(ctx);
    const response = ('undefined' !== typeof rawResponse?.isBase64Encoded) ? rawResponse : await ctx.helpers.http(rawResponse);
    return {
        ...response,
        headers: {
            'Cache-Control': ctx.config?.defaultCache || 'no-cache', // this default value can be overriden at multiple levels
            ...(ctx.config.defaultHeaders || {}), // these headers are automatically set
            ...(route?.headers || {}),
            ...(route?.cache ? {'Cache-Control': route!.cache} : {}),
            ...(response.headers || {}),
        }
    };
}

export default defaultProcessHandler
import {ctx, http_response, UnderlyingExecutionError} from "@ohoareau/lambda-utils";
import * as availableStaticSources from "../sources-static";

export async function file(ctx: ctx): Promise<http_response> {
    const sources = {...availableStaticSources, ...(ctx.config.static_sources || {})};
    const sourceName = ctx.query.source || 'default';
    const source = sources[sourceName];
    if (!source) return ctx.helpers.httpNotFound();
    try {
        const sourced = (await source(ctx)) || {};
        if (!sourced ) return ctx.helpers.httpNotFound();
        if (sourced.buffer) return ctx.helpers.buffer({contentType: 'application/pdf', ...sourced});
        if (sourced.location) return ctx.helpers.redirect(sourced);
        if (!source.headers && !source.body) return ctx.helpers.httpNotFound();
        return ctx.helpers.http(sourced);
    } catch (e) {
        throw new UnderlyingExecutionError(e, 'file', {sourceName});
    }
}

export default file
import {ctx, http_response} from "@ohoareau/lambda-utils";
import * as availableSources from "../sources";

export async function redirect(ctx: ctx): Promise<http_response> {
    const sources = {...availableSources, ...(ctx.config.sources || {})};
    const source = sources[ctx.query.source || 'default'];
    if (!source) return ctx.helpers.httpNotFound();
    const sourced = (await source(ctx)) || {};
    if (!sourced || !sourced.location) return ctx.helpers.httpNotFound();
    return ctx.helpers.redirect(sourced);
}

export default redirect
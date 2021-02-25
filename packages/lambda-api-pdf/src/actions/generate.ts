import {ctx, http_response, UnderlyingExecutionError} from "@ohoareau/lambda-utils";
import * as availableSources from "../sources";
import {render} from '@ohoareau/react-document-renderer';

export async function generate(ctx: ctx): Promise<http_response> {
    const sources = {...availableSources, ...(ctx.config.sources || {})};
    const sourceName = ctx.query.source || 'default';
    const source = sources[sourceName];
    if (!source) return ctx.helpers.httpNotFound();
    const sourced = (await source(ctx)) || {};
    if (!sourced || !sourced.definition) return ctx.helpers.httpNotFound();
    try {
        return ctx.helpers.buffer({contentType: 'application/pdf', ...sourced, buffer: await render(sourced.definition)});
    } catch (e) {
        throw new UnderlyingExecutionError(e, 'generate', {sourceName});
    }
}

export default generate
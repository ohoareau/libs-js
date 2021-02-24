import {ctx, http_response} from "@ohoareau/lambda-utils";
import * as availableSources from "../sources";
import {render} from '@ohoareau/react-document-renderer';

export async function generatePdf(ctx: ctx): Promise<http_response> {
    const sources = {...availableSources, ...(ctx.config.sources || {})};
    const source = sources[ctx.query.source || 'default'];
    if (!source) return ctx.helpers.httpNotFound();
    const sourced = (await source(ctx)) || {};
    if (!sourced || !sourced.definition) return ctx.helpers.httpNotFound();
    return ctx.helpers.buffer({contentType: 'application/pdf', ...sourced, buffer: await render(sourced.definition)});
}

export default generatePdf
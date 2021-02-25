import {ctx, http_response, UnderlyingExecutionError} from "@ohoareau/lambda-utils";
import * as availableSources from "../sources";
import XLSX from 'xlsx';

async function render(def: any) {
    const wb = XLSX.utils.book_new();
    // @todo
    return XLSX.write(wb, {type: 'buffer'});
}

export async function generate(ctx: ctx): Promise<http_response> {
    const sources = {...availableSources, ...(ctx.config.sources || {})};
    const sourceName = ctx.query.source || 'default';
    const source = sources[sourceName];
    if (!source) return ctx.helpers.httpNotFound();
    const sourced = (await source(ctx)) || {};
    if (!sourced || !sourced.definition) return ctx.helpers.httpNotFound();
    try {
        return ctx.helpers.buffer({contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ...sourced, buffer: await render(sourced.definition)});
    } catch (e) {
        throw new UnderlyingExecutionError(e, 'generate', {sourceName});
    }
}

export default generate
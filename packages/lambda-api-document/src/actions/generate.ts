import {ctx, http_response, UnderlyingExecutionError} from "@ohoareau/lambda-utils";
import * as availableSources from "../sources";
import { Document, Packer, Paragraph, TextRun } from 'docx';

async function render(def: any) {
    const doc = new Document();

    // @todo
    doc.addSection({
        properties: {},
        children: [
            new Paragraph({
                children: [
                    new TextRun("Hello World"),
                    new TextRun({
                        text: "Foo Bar",
                        bold: true,
                    }),
                    new TextRun({
                        text: "\tGithub is the best",
                        bold: true,
                    }),
                ],
            }),
        ],
    });

    return Packer.toBuffer(doc);
}

export async function generate(ctx: ctx): Promise<http_response> {
    const sources = {...availableSources, ...(ctx.config.sources || {})};
    const sourceName = ctx.query.source || 'default';
    const source = sources[sourceName];
    if (!source) return ctx.helpers.httpNotFound();
    const sourced = (await source(ctx)) || {};
    if (!sourced || !sourced.definition) return ctx.helpers.httpNotFound();
    try {
        return ctx.helpers.buffer({contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ...sourced, buffer: await render(sourced.definition)});
    } catch (e) {
        throw new UnderlyingExecutionError(e, 'generate', {sourceName});
    }
}

export default generate
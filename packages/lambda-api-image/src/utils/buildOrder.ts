import {order} from "../types";
import {ctx, ResourceNotFoundError, detectContentTypeFromFileName} from "@ohoareau/lambda-utils";
import * as availableSourceTypes from "../sources";
import {detectFormatFromFileName} from "@ohoareau/imageman";
import * as modifiers from "../modifiers";

export async function buildOrder(ctx: ctx): Promise<order> {

    // then, we need to convert this request into an imageman-compatible order
    // (with a list of operations, input location, ...).
    // essentially depending on the request uri with patterns that are detected based on rules from the config.

    const modifierNames = [
        'preset', 'size', 'trim', 'flip', 'format', 'radius', 'filter',
        'rotation', 'theme', 'color', 'quality',
    ];

    let {input = undefined, operations = [], options = undefined, format} = await modifierNames.reduce(async (acc: any, modifier: string) => {
        acc = await acc;
        if (!modifiers[modifier]) return acc;
        return (await modifiers[modifier](acc, ctx.request, ctx.config)) || acc;
    }, Promise.resolve({input: undefined, operations: [], options: {}} as unknown as order));

    // we are now ready to process the rule in order the complete the creation of the order that will contain
    // the list of operations to send to imageman.

    const sources = {...availableSourceTypes, ...(ctx.config.sources || {})};
    const source = sources[ctx.query.source || 'default'];
    if (!source) throw new ResourceNotFoundError(ctx.request);
    const sourced = (await source(ctx)) || {};
    sourced.input && (input = sourced.input);
    sourced.operations && (operations = sourced.operations);
    sourced.options && (options = sourced.options);
    sourced.format && (format = sourced.format);

    let formatFromFile: any = undefined;
    let contentTypeFromFile: string|undefined = undefined;

    if (ctx.query?.file) {
        formatFromFile = detectFormatFromFileName(ctx.query?.file);
        contentTypeFromFile = detectContentTypeFromFileName(ctx.query?.file);
    }
    const opts = {
        ...(options || {}),
        ...((contentTypeFromFile || options?.contentType)
            ? {contentType: contentTypeFromFile || options?.contentType}
            : {}),
    };

    return {
        input,
        format: formatFromFile || format,
        operations: [
            ...operations,
            ...(operations || []),
        ],
        options: opts,
        sourceTypes: {
            ...(ctx.config.sourceTypes || {}),
        },
        targetTypes: {
            ...(ctx.config.targetTypes || {}),
        },
        output: 'buffer',
    };
}

export default buildOrder
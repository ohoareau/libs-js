import {ctx, ResourceNotFoundError} from '@ohoareau/lambda-utils';
import {document_definition} from "@ohoareau/react-document-renderer";

export async function demo(ctx: ctx): Promise<{definition: document_definition}|undefined> {
    let {file = 'demo'} = ctx.query;
    const path = `${__dirname}/../../examples/${(file || '').replace(/[^a-z0-9_-]+/g, '')}.json`;
    try {
        if (!require.resolve(path)) return undefined;
        return require(path);
    } catch (e) {
        throw new ResourceNotFoundError(ctx.request)
    }
}

export default demo
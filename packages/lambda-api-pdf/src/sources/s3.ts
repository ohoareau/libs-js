import {s3 as awss3} from '@ohoareau/aws';
import {ctx} from '@ohoareau/lambda-utils';
import {document_definition} from "@ohoareau/react-document-renderer";

export async function s3(ctx: ctx): Promise<{definition: document_definition}|undefined> {
    let {bucket, name} = ctx.query;
    const bucketName = (ctx.config?.buckets || {})[bucket];
    if (!bucketName) return undefined;
    if ('function' === typeof bucketName) {

    }
    return {
        definition: await awss3.fromJsonFile(bucketName, `${name}.json`),
    };
}

export default s3
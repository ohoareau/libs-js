import {ctx, detectContentTypeFromFileName, ResourceNotFoundError} from '@ohoareau/lambda-utils';

export async function s3(ctx: ctx, config: any) {
    const {bucket, key} = ctx.query;
    const bucketName = (config.buckets || {})[bucket];
    if (!bucketName || !key) throw new ResourceNotFoundError(ctx.request);
    const options: any = {};
    const contentType = detectContentTypeFromFileName(key);
    contentType && (options.contentType = contentType);
    return {
        input: `s3://${bucketName}/${key}`,
        options,
    };
}
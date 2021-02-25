import {s3 as awss3} from '@ohoareau/aws';
import {ctx} from '@ohoareau/lambda-utils';

export async function s3(ctx: ctx): Promise<any|undefined> {
    let {bucket, name} = ctx.query;
    const bucketName = (ctx.config?.buckets || {})[bucket];
    if (!bucketName) return undefined;
    return {
        definition: await awss3.fromJsonFile(bucketName, `${name}.json`),
    };
}

export default s3
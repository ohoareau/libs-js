import {ctx} from '@ohoareau/lambda-utils';
import {s3 as awss3} from '@ohoareau/aws';

export async function s3(ctx: ctx) {
    try {
        const {bucket, key} = ctx.query;
        const data = await awss3.fromJsonFile(bucket, key);
        if (!data || !data.location) return undefined;
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
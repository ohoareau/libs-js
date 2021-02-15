import {s3 as awss3} from '@ohoareau/aws';

export async function s3({bucket, prefix = undefined, path}: {bucket: string, prefix?: string, path: string}) {
    try {
        const data = await awss3.fromJsonFile(bucket, `${prefix ? prefix : ''}${prefix ? '/' : ''}${path}`);
        if (!data || !data.location) return undefined;
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
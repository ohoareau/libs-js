let AWS: any = undefined;

export async function s3({location}: any) {
    const [bucket, key] = location.split('/');
    AWS = AWS || require('aws-sdk');
    const s3 = new AWS!.S3();

    return (await s3.getObject({
        Bucket: bucket,
        Key: key,
    }).promise()).Body;
}
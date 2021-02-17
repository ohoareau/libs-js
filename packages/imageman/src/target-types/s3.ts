let AWS: any = undefined;

export async function s3(img, {location}: any) {
    const [bucket, key] = location.split('/');
    AWS = AWS || require('aws-sdk');
    const s3 = new AWS!.S3();

    return s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: await img.toBuffer(),
    }).promise();
}
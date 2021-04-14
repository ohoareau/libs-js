const path = require('path');
const awss3 = new (require('aws-sdk/clients/s3'));

const getFile = async ({bucket, key, raw = false}) => {
    const f = await awss3.getObject({Bucket: bucket, Key: key}).promise();
    return {body: (f && f.Body) ? (raw ? f.Body : f.Body.toString()) : undefined};
};

const setFile = async ({bucket, key}, content) =>
    awss3.putObject({Bucket: bucket, Key: key, Body: content}).promise()
;
const deleteFile = async ({bucket, key}) =>
    awss3.deleteObject({Bucket: bucket, Key: key}).promise()
;

const deleteDirectory = async ({bucket, key}) => {
    const files = await awss3.listObjects({Bucket: bucket, Prefix: `${key}/`}).promise();
    if (!files || !files.Contents || !files.Contents.length) return [];
    const objects: {Key: string}[] = files.Contents.map(f => ({Key: f.Key}));
    await awss3.deleteObjects({Bucket: bucket, Delete: {Objects: objects}}).promise();
    return [...objects, ...(await deleteDirectory({bucket, key}))];
};

const getFileMetadata = async ({bucket, key, original = false}: {bucket: string, key: string, original?: boolean}) => {
    const m = await awss3.headObject({Bucket: bucket, Key: key}).promise();
    return original ? {...m} : {
        contentLength: m.ContentLength,
        contentType: m.ContentType,
        eTag: m.ETag,
        lastModified: m.LastModified,
    }
};
const getFileContent = async query => (await getFile(query)).body;
const setFileContent = setFile;

const fromJsonFile = async (bucket, key) => JSON.parse(await getFileContent({bucket, key}));
const toJsonFile = async (bucket, key, data) => setFileContent({bucket, key}, JSON.stringify(data));

const getFileUploadUrl = async ({bucket, key, expires = 60}) => new Promise((resolve, reject) => {
    awss3.createPresignedPost(
        {Bucket: bucket, Expires: parseInt(<any>expires), Fields: {key}},
        (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    uploadUrl: data['url'],
                    fileUrl: `${data['url']}/${key}`,
                    fields: JSON.stringify(data['fields']),
                });
            }
        }
    );
});

const getFileDownloadUrl = async ({bucket, key, name, ttl = undefined}: {bucket: string, key: string, name: string, ttl?: number}) => {
    const fileName = name || path.basename(key);
    const url = await awss3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
        ...(ttl ? {Expires: ttl} : {}),
    });
    return {
        downloadUrl: url,
        fileUrl: url,
        fields: JSON.stringify({}),
        fileName,
    }
};

const getFileViewUrl = async ({bucket, key, contentType, ttl = undefined}: {bucket: string, key: string, contentType: string, ttl?: number}) => {
    const url = await awss3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        ...(contentType ? {ResponseContentType: contentType} : {}),
        ResponseContentDisposition: 'inline',
        ...(ttl ? {Expires: ttl} : {}),
    });
    return {
        viewUrl: url,
        fileUrl: url,
        fields: JSON.stringify({}),
        contentType,
    }
};

export const s3 = {
    deleteFile,
    deleteDirectory,
    getFile,
    getFileContent,
    getFileUploadUrl,
    getFileDownloadUrl,
    getFileViewUrl,
    fromJsonFile,
    toJsonFile,
    setFile,
    setFileContent,
    getFileMetadata,
}

export default s3
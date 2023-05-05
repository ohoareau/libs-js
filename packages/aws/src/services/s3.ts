const path = require('path');
const awss3 = new (require('aws-sdk/clients/s3'));

const getFile = async ({bucket, key, raw = false}) => {
    const f = await awss3.getObject({Bucket: bucket, Key: key}).promise();
    return {body: (f && f.Body) ? (raw ? f.Body : f.Body.toString()) : undefined};
};

const setFile = async ({bucket, key, metadata = undefined, contentType = undefined, acl = undefined, cacheControl = undefined, expires = undefined}: any, content) =>
    awss3.putObject({
        Bucket: bucket,
        Key: key,
        Body: content,
        ...(contentType ? {ContentType: contentType} : {}),
        ...(cacheControl ? {CacheControl: cacheControl} : {}),
        ...(expires ? {Expires: expires} : {}),
        ...(acl ? {ACL: acl} : {}),
        ...(metadata ? {Metadata: metadata}: {}),
    }).promise()
;
const deleteFile = async ({bucket, key}) =>
    awss3.deleteObject({Bucket: bucket, Key: key}).promise()
;
const copyFile = async ({bucket, key, targetKey, targetBucket}: {bucket: string, key: string, targetKey?: string, targetBucket?: string}) => {
    const a = {bucket, key};
    const b = {bucket: targetBucket || bucket, key: targetKey || key};

    return awss3.copyObject({Bucket: b.bucket, Key: b.key, CopySource: `/${a.bucket}/${a.key}`}).promise()
};
const moveFile = async (opts: {bucket: string, key: string, targetKey?: string, targetBucket?: string}) => {
    await copyFile(opts);
    return deleteFile({bucket: opts.bucket, key: opts.key});
};

const listFiles = async ({bucket, key, raw = false, from, limit}: {bucket: string, key?: string, raw?: boolean, from?: string, limit?: number}) => {
    const files = await awss3.listObjects({...(limit ? {MaxKeys: limit} : {}), Bucket: bucket, ...(key ? {Prefix: `${key}/`} : {}), ...(from ? {Marker: from} : {})}).promise();
    if (!files || !files.Contents || !files.Contents.length) return [];
    return raw ? [...files.Contents] : files.Contents.map(f => f.Key);
};

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
const toJsonFile = async (bucket, key, data, metadata = undefined, contentType = 'application/json', acl = undefined, cacheControl = undefined, expires = undefined) => setFileContent({bucket, key, metadata, contentType, acl, cacheControl, expires}, JSON.stringify(data));

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

const getFileViewUrl = async ({bucket, key, contentType, name = undefined, ttl = undefined}: {bucket: string, key: string, contentType: string, name?: string, ttl?: number}) => {
    const url = await awss3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        ...(contentType ? {ResponseContentType: contentType} : {}),
        ResponseContentDisposition: name ? `inline; filename="${name}"` : 'inline',
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
    listFiles,
    moveFile,
    copyFile,
}

export default s3
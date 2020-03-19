const path = require('path');
const s3 = new (require('aws-sdk/clients/s3'));

const getFile = async ({bucket, key, raw = false}) => {
    const f = await s3.getObject({Bucket: bucket, Key: key}).promise();
    return {body: (f && f.Body) ? (raw ? f.Body : f.Body.toString()) : undefined};
};

const setFile = async ({bucket, key}, content) =>
    s3.putObject({Bucket: bucket, Key: key, Body: content}).promise()
;
const deleteFile = async ({bucket, key}) =>
    s3.deleteObject({Bucket: bucket, Key: key}).promise()
;

const getFileContent = async query => (await getFile(query)).body;
const setFileContent = setFile;

const fromJsonFile = async (bucket, key) => JSON.parse(await getFileContent({bucket, key}));
const toJsonFile = async (bucket, key, data) => setFileContent({bucket, key}, JSON.stringify(data));

const getFileUploadUrl = async ({bucket, key, expires = 60}) => new Promise((resolve, reject) => {
    s3.createPresignedPost(
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

const getFileDownloadUrl = async ({bucket, key, name}) => {
    const fileName = name || path.basename(key);
    const url = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });
    return {
        downloadUrl: url,
        fileUrl: url,
        fields: JSON.stringify({}),
        fileName,
    }
};

const getFileViewUrl = async ({bucket, key, contentType}) => {
    const url = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucket,
        Key: key,
        ...(contentType ? {ResponseContentType: contentType} : {}),
        ResponseContentDisposition: 'inline',
    });
    return {
        viewUrl: url,
        fileUrl: url,
        fields: JSON.stringify({}),
        contentType,
    }
};

export default {
    deleteFile,
    getFile,
    getFileContent,
    getFileUploadUrl,
    getFileDownloadUrl,
    getFileViewUrl,
    fromJsonFile,
    toJsonFile,
}
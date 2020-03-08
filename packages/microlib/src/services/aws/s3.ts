const s3 = new (require('aws-sdk/clients/s3'));

const getFile = async ({bucket, key}) => {
    const f = await s3.getObject({Bucket: bucket, Key: key}).promise();
    return {body: (f && f.Body) ? f.Body.toString() : undefined};
};

const getFileContent = async query => (await getFile(query)).body;

const fromJsonFile = async (bucket, key) => JSON.parse(await getFileContent({bucket, key}));

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

const getFileDownloadUrl = async ({bucket, key}) => {
    const url = await s3.getSignedUrlPromise('getObject', {Bucket: bucket, Key: key});
    return {
        downloadUrl: url,
        fileUrl: url,
        fields: JSON.stringify({}),
    }
};

export default {
    getFile,
    getFileContent,
    getFileUploadUrl,
    getFileDownloadUrl,
    fromJsonFile,
}
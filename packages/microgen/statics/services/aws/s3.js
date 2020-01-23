const s3 = new (require('aws-sdk/clients/s3'));

module.exports = {
    getFileUploadUrl: async ({bucket, key, expires = 60}) => new Promise((resolve, reject) => {
        s3.createPresignedPost(
            {Bucket: bucket, Expires: parseInt(expires), Fields: {key}},
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
    }),
    getFileDownloadUrl: async ({bucket, key}) =>
        s3.getSignedUrlPromise('getObject', {Bucket: bucket, Key: key})
    ,
};
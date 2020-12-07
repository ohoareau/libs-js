const awsses = new (require('aws-sdk/clients/ses'))({region: process.env.AWS_SES_REGION || process.env.AWS_REGION});

export const ses = {
    sendEmail: async ({source, sourceArn, to = [], cc = [], bcc = [], replyTo = [], body, bodyText, subject}) =>
        awsses.sendEmail({
            Destination: {
                BccAddresses: bcc,
                CcAddresses: cc,
                ToAddresses: to,
            },
            Message: {
                Body: {
                    ...(body ? {Html: {Charset: 'UTF-8', Data: body}} : {}),
                    ...(bodyText ? {Text: {Charset: 'UTF-8', Data: bodyText}} : {}),
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                }
            },
            ReplyToAddresses: replyTo,
//            ReturnPath: source,
//            ReturnPathArn: sourceArn,
            Source: source,
            SourceArn: sourceArn,
        }).promise()
    ,
}

export default ses
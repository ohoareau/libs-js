const ses = new (require('aws-sdk/clients/ses'))({region: process.env.AWS_SES_REGION || process.env.AWS_REGION});

export default {
    sendEmail: async ({source, sourceArn, to = [], cc = [], bcc = [], replyTo = [], body, bodyText, subject}) =>
        ses.sendEmail({
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
            ReturnPath: '',
            ReturnPathArn: '',
            Source: source,
            SourceArn: sourceArn,
        }).promise()
    ,
}
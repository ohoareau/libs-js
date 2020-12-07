const awssqs = new (require('aws-sdk/clients/sqs'));

export const sqs = {
    deleteMessage: async ({queueUrl, receiptHandle}) =>
        awssqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle}).promise()
    ,
    getQueueUrlFromEventSourceArn: (arn) => {
        const splits = arn.split(':');
        return awssqs.endpoint.href + splits[4] + '/' + splits[5];
    }
}

export default sqs
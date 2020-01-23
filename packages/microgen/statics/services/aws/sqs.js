const sqs = new (require('aws-sdk/clients/sqs'));

module.exports = {
    deleteMessage: async ({queueUrl, receiptHandle}) =>
        sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle}).promise()
    ,
    getQueueUrlFromEventSourceArn: (arn) => {
        const splits = arn.split(':');
        return sqs.endpoint.href + splits[4] + '/' + splits[5];
    }
};
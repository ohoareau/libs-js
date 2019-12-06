import AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export default () => ({
    deleteMessage: async ({queueUrl, receiptHandle}) =>
        sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle}).promise()
    ,
    getQueueUrlFromEventSourceArn: (arn) => {
        const splits = arn.split(':');
        return sqs.endpoint.href + splits[4] + '/' + splits[5];
    }
});
const sns = new (require('aws-sdk/clients/sns'));

module.exports = {
    publish: async ({message, attributes, topic}) => sns.publish({
        Message: JSON.stringify(await message),
        MessageAttributes: Object.entries(attributes).reduce((acc, [k, v]) => {
            acc[k] = {DataType: 'String', StringValue: v};
            return acc;
        }, {}),
        TopicArn: topic,
    }).promise(),
};
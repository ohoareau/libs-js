import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export default () => ({
    publish: async ({message, attributes, topic}) => sns.publish({
        Message: JSON.stringify(await message),
        MessageAttributes: Object.entries(attributes).reduce((acc, [k, v]) => {
            acc[k] = {DataType: 'String', StringValue: v};
            return acc;
        }, {}),
        TopicArn: topic,
    }),
});
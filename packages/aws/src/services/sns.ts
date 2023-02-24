const awssns = new (require('aws-sdk/clients/sns'));

export const sns = {
    publish: async ({message, attributes, topic, group }) => awssns.publish({
        Message: JSON.stringify(await message),
        ...(group ? {MessageGroupId:group} : {}),
        MessageAttributes: Object.entries(attributes).reduce((acc, [k, v]) => {
            acc[k] = {DataType: 'String', StringValue: v};
            return acc;
        }, {}),
        TopicArn: topic,
    }).promise(),
}

export default sns
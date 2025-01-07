const awssns = new (require('aws-sdk/clients/sns'));

export type publish_order = {
    message: any;
    attributes: Record<string, any>;
    topic: string;
    group?: string;
    deduplication?: string;
    subject?: string;
}
export const sns = {
    publish: async ({message, attributes, topic, group, deduplication, subject }: publish_order) => awssns.publish({
        Message: JSON.stringify(await message),
        ...(group ? {MessageGroupId: group} : {}),
        ...(deduplication ? {MessageDeduplicationId: deduplication} : {}),
        ...(subject ? {Subject: subject} : {}),
        MessageAttributes: Object.entries(attributes).reduce((acc, [k, v]) => {
            acc[k] = {DataType: 'String', StringValue: v};
            return acc;
        }, {}),
        TopicArn: topic,
    }).promise(),
}

export default sns

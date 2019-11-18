import AWS from "aws-sdk";

const sns = new AWS.SNS();

export default def => async ctx => {
    if (def.condition && !def.condition(ctx)) {
        return;
    }
    await sns.publish({
        Message: JSON.stringify(ctx.result),
        MessageAttributes: {
            fullType: {
                DataType: 'String', /* required */
                StringValue: `${ctx.type}_${ctx.operation}`,
            },
            type: {
                DataType: 'String', /* required */
                StringValue: ctx.type,
            },
            operation: {
                DataType: 'String', /* required */
                StringValue: ctx.operation,
            },
        },
        TopicArn: def.topic,
    }).promise();
};
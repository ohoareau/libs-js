import AWS from "aws-sdk";
import {Definition} from "../..";

const sns = new AWS.SNS();

export default (hc: Definition) => async (ctx, action) => {
    const cfg = hc.config || {};
    if (cfg.condition && !cfg.condition(ctx)) return;
    await sns.publish({
        Message: JSON.stringify(await action.res.result),
        MessageAttributes: {
            fullType: {DataType: 'String', StringValue: `${ctx.config.type}_${action.req.operation}`},
            type: {DataType: 'String', StringValue: ctx.config.type},
            operation: {DataType: 'String', StringValue: action.req.operation},
        },
        TopicArn: cfg.topic,
    }).promise();
};
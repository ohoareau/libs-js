import AWS from "aws-sdk";
import {Config, Definition} from "../..";

const sns = new AWS.SNS();

export default (hc: Definition, c: Config) => async (action) => {
    const cfg = hc.config || {};
    await sns.publish({
        Message: JSON.stringify(await action.res.result),
        MessageAttributes: {
            fullType: {DataType: 'String', StringValue: `${c.type}_${action.req.operation}`},
            type: {DataType: 'String', StringValue: c.type},
            operation: {DataType: 'String', StringValue: action.req.operation},
        },
        TopicArn: cfg.topic,
    }).promise();
};
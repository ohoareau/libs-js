import AWS from 'aws-sdk';
import InvokeError from "../errors/InvokeError";

const lambda = new AWS.Lambda();

export default () => ({
    execute: async (arn, payload: any, options: any = {}) => {
        const logger = ((options ? options.logger : undefined) || console);
        logger.log(`Invoking lambda '${arn}' with`, payload);
        const result = await lambda.invoke({
            FunctionName: arn,
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(payload),
        }).promise();
        if (result.FunctionError) throw new InvokeError(
            '?',
            '?',
            arn,
            payload,
            JSON.parse(<string>(result.Payload ? (result.Payload.toString ? result.Payload.toString() : result.Payload) : '{}'))
        );
        logger.log(`Lambda '${arn}' responded with: `, result);
        return result;
    },
});
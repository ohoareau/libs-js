import AWS from 'aws-sdk';
import {Map, TypedMap, Config} from "../..";
import InvokeError from "../../errors/InvokeError";

const lambda = new AWS.Lambda();

export default (lc: TypedMap, c: Config) => async (operation: string, payload: Map, options: Map = {}): Promise<any> => {
    const logger = ((options ? options.logger : undefined) || console);
    logger.log(`Invoking lambda '${lc.arn}' to execute operation '${<string>(<any>options).operation}'`, payload);
    const result = await lambda.invoke({
        FunctionName: lc.arn,
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(payload),
    }).promise();
    if (result.FunctionError) {
        throw new InvokeError(
            c.type,
            <string>(<any>options).operation,
            lc.arn,
            payload,
            JSON.parse(<string>(result.Payload ? (result.Payload.toString ? result.Payload.toString() : result.Payload) : '{}'))
        );
    }
    logger.log(`Lambda '${lc.arn}' responded with: `, result);
    return result;
}
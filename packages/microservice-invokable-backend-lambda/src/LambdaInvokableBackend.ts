import AWS from 'aws-sdk';
import InvokableBackendInterface from "@ohoareau/microservice/lib/InvokableBackendInterface";
import {InvokableBackendConfig, InvokePayload, Options, TypeConfig} from "@ohoareau/microservice/lib/types";
import LambdaInvokeError from "./LambdaInvokeError";

const lambda = new AWS.Lambda();

export default class LambdaInvokableBackend implements InvokableBackendInterface {
    private readonly arn: string;
    private readonly type: string;
    constructor(config: InvokableBackendConfig, typeConfig: TypeConfig) {
        this.arn = config.arn;
        this.type = config.fullType;
    }
    async invoke(operation: string, payload: InvokePayload, options: Options): Promise<any> {
        const logger = ((options ? options.logger : undefined) || console);
        logger.log(`Invoking lambda '${this.arn}' to execute operation '${<string>(<any>options).operation}'`, payload);
        const result = await lambda.invoke({
            FunctionName: this.arn,
            InvocationType: 'RequestResponse',
            LogType: 'None',
            Payload: JSON.stringify(payload),
        }).promise();
        if (result.FunctionError) {
            throw new LambdaInvokeError(
                this.type,
                <string>(<any>options).operation,
                this.arn,
                payload,
                JSON.parse(<string>(result.Payload ? (result.Payload.toString ? result.Payload.toString() : result.Payload) : '{}'))
            );
        }
        logger.log(`Lambda '${this.arn}' responded with: `, result);
        return result;
    }
}
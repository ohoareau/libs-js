import {InvokeError} from '@ohoareau/errors';
import Lambda from 'aws-sdk/clients/lambda';
import STS from 'aws-sdk/clients/sts';
const awsLambda = new (Lambda);

const execute = async (arn, payload, options: any = {}) => {
    options = {async: false, ...options};
    const logger = ((options ? options['logger'] : undefined) || console);
    logger.log(`Invoking lambda '${arn}'${options?.assumeRoleArn ? ` on role '${options['assumeRoleArn']}'` : ''} with`, payload);
    const result = await (await buildLambda(options['assumeRoleArn'])).invoke({
        FunctionName: arn,
        InvocationType: !!options['async'] ? 'Event' : 'RequestResponse',
        LogType: 'None',
        Payload: 'string' === typeof payload ? payload : JSON.stringify(payload),
    }).promise();
    const responsePayload = JSON.parse((result.Payload ? (result.Payload.toString ? result.Payload.toString() : result.Payload) : '{}') as any);
    if (result.FunctionError) throw new InvokeError(
        '?',
        '?',
        arn,
        payload,
        responsePayload
    );
    logger.log(`Lambda '${arn}' ${!!options['async'] ? 'called asynchronously ' : ''}responded '${result.StatusCode}' with: `, responsePayload || result);
    return responsePayload;
};


const buildLambda = async (roleArn: string|undefined) => {
    if(undefined === roleArn) return awsLambda;

    const res = await new STS().assumeRole({
        RoleArn: roleArn!,
        RoleSessionName: 'session1',
        DurationSeconds: 20*60,
    }).promise();

    return new Lambda({
        accessKeyId: res.Credentials?.AccessKeyId,
        secretAccessKey: res.Credentials?.SecretAccessKey,
        sessionToken: res.Credentials?.SessionToken,
    });
};

export const lambda = {execute}

export default lambda
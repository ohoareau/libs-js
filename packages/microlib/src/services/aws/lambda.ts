import InvokeError from '../../errors/InvokeError';
const lambda = new (require('aws-sdk/clients/lambda'));

const execute = async (arn, payload, options = {}) => {
    options = {async: false, ...options};
    const logger = ((options ? options['logger'] : undefined) || console);
    logger.log(`Invoking lambda '${arn}' with`, payload);
    const result = await lambda.invoke({
        FunctionName: arn,
        InvocationType: !!options['async'] ? 'Event' : 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(payload),
    }).promise();
    const responsePayload = JSON.parse(result.Payload ? (result.Payload.toString ? result.Payload.toString() : result.Payload) : '{}');
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

export default {execute}
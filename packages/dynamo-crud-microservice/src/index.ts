import crud from '@ohoareau/dynamo-crud';
import AWS from 'aws-sdk';

const buildQueueUrlFromArn = (sqs, arn): string => {
    const splits = arn.split(':');
    return sqs.endpoint.href + splits[4] + '/' + splits[5];
};
const sqs = new AWS.SQS();

export default (definition): any => {
    const crudService = crud(definition);
    const { get, find, update, remove, create } = crudService;
    const t = `${definition.type.substr(0, 1).toUpperCase()}${definition.type.substr(1)}`;
    const st = `${definition.type.substr(0, 1).toLowerCase()}${definition.type.substr(1)}`;
    const ts = `${t}s`;
    const handlers: {[key: string]: any} = {
        [`get${t}`]: ({ params: { id } }) => get(id),
        [`get${ts}`]: () => find(),
        [`update${t}`]: ({ params: { id, input } }) => update(id, input),
        [`delete${t}`]: ({ params: { id } }) => remove(id),
        [`create${t}`]: ({ params: { input } }) => create(input),
        [`${st}Service`]: crudService,
    };
    if (definition.receiveExternalEvents) {
        handlers.receiveExternalEvents = async (event, context) => {
            if (!event.Records || !event.Records.length) {
                return;
            }
            await Promise.all(event.Records.map(async r => {
                const receiptHandle = r.receiptHandle;
                const body = JSON.parse(r.body);
                const eventType = body.MessageAttributes.fullType.Value.toLowerCase().replace(/_/, '.');
                const queueUrl = buildQueueUrlFromArn(sqs, r.eventSourceARN);
                if (definition.receiveExternalEvents[eventType]) {
                    const attributes = Object.keys(body.MessageAttributes).reduce((acc, k) => {
                        acc[k] = body.MessageAttributes[k].Value;
                        return acc;
                    }, {});
                    await definition.receiveExternalEvents[eventType](JSON.parse(body.Message), {
                        attributes,
                        service: crudService,
                        type: definition.type,
                        context,
                        queueUrl,
                        receiptHandle,
                    });
                }
                sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
            }));
        };
    }
    return handlers;
};
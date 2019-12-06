import AWS from 'aws-sdk';
import {Map, TypedMap, Handler, Config} from "../..";

const sqs = new AWS.SQS();

const processDirectMessage = async (ec: TypedMap, c: Config, context: any, r: Map) => {
    const receiptHandle = r.receiptHandle;
    const message = JSON.parse(r.body);
    const eventType = r.messageAttributes.fullType.stringValue.toLowerCase().replace(/\./g, '_');
    const splits = r.eventSourceARN.split(':');
    const queueUrl = sqs.endpoint.href + splits[4] + '/' + splits[5];
    const listeners = c.getListenersFor(eventType);
    if (0 < listeners.length) {
        const attributes = Object.entries(r.messageAttributes).reduce((acc, [k, m]) => {
            acc[k] = (<Map>m).stringValue;
            return acc;
        }, {});
        c.log('external event', 'PROCESSING', eventType, message, attributes, receiptHandle, 'DIRECT');
        await Promise.all(listeners.map(async (listener: Handler) => listener(
            message,
            {attributes, execute: c.execute, config: c, context, queueUrl, receiptHandle}
        )));
        c.log('external event', 'PROCESSED', eventType, receiptHandle, 'DIRECT');
    } else {
        c.log('external event', 'IGNORED', eventType, receiptHandle, 'DIRECT');
    }
    sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
};

const processEncapsulatedMessage = async (ec: TypedMap, c: Config, context: any, r: Map) => {
    const receiptHandle = r.receiptHandle;
    const body = JSON.parse(r.body);
    const eventType = body.MessageAttributes.fullType.Value.toLowerCase().replace(/\./g, '_');
    const splits = r.eventSourceARN.split(':');
    const queueUrl = sqs.endpoint.href + splits[4] + '/' + splits[5];
    if (c.eventListeners && c.eventListeners[eventType]) {
        const attributes = Object.entries(body.MessageAttributes).reduce((acc, [k, m]) => {
            acc[k] = (<Map>m).Value;
            return acc;
        }, {});
        const message = JSON.parse(body.Message);
        c.log('external event', 'PROCESSING', eventType, message, attributes, receiptHandle, 'ENCAPSULATED');
        await (<Handler>c.eventListeners[eventType])(
            message,
            {
                attributes,
                execute: c.execute,
                config: c,
                context,
                queueUrl,
                receiptHandle,
            }
        );
        c.log('external event', 'PROCESSED', eventType, receiptHandle, 'ENCAPSULATED');
    } else {
        c.log('external event', 'IGNORED', eventType, receiptHandle, 'ENCAPSULATED');
    }
    sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
};

export default (ec: TypedMap, c: Config) => async (event: any, context: any): Promise<any> => {
    if (!event.Records || !event.Records.length) return;
    await Promise.all(event.Records.map(async r =>
        (r.messageAttributes && r.messageAttributes.fullType && r.messageAttributes.fullType.stringValue)
            ? processDirectMessage(ec, c, context, r)
            : processEncapsulatedMessage(ec, c, context, r)
    ));
}
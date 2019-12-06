import {Map, TypedMap, Handler, Config} from "../..";
import sqsFactory from '../../factories/sqs';

const sqs = sqsFactory();

const consumeMessage = async (c, {receiptHandle, attributes, rawMessage, eventType, queueUrl}, context) => {
    const listeners = c.getListenersFor(eventType);
    const result = {status: 'ignored', listeners: listeners.length, clean: async (result, {ids, processed, ignored}) => {
        if (!ignored[receiptHandle]) ignored[receiptHandle] = 0;
        if (!processed[receiptHandle]) processed[receiptHandle] = 0;
        switch (result.status) {
            case 'processed': processed[receiptHandle]++; break;
            case 'ignored': ignored[receiptHandle]++; break;
        }
        if (ids[receiptHandle]) return;
        await sqs.deleteMessage({queueUrl, receiptHandle});
        ids[receiptHandle] = true;
    }};
    if (!listeners.length) return result;
    const message = JSON.parse(rawMessage);
    c.log('external event', 'PROCESSING', eventType, message, attributes, receiptHandle, 'ENCAPSULATED');
    await Promise.all(listeners.map(async (listener: Handler) => listener(
        message,
        {attributes, execute: c.execute, config: c, context, queueUrl, receiptHandle}
    )));
    c.log('external event', 'PROCESSED', eventType, receiptHandle, 'ENCAPSULATED');
    result.status = 'processed';
    return result;
};

const processDirectMessage = async (ec: TypedMap, c: Config, context: any, r: Map) =>
    consumeMessage(c, {
        receiptHandle: r.receiptHandle,
        rawMessage: r.body,
        attributes: Object.entries(r.messageAttributes).reduce((acc, [k, m]) => {
            acc[k] = (<Map>m).stringValue;
            return acc;
        }, {}),
        eventType: r.messageAttributes.fullType.stringValue.toLowerCase().replace(/\./g, '_'),
        queueUrl: sqs.getQueueUrlFromEventSourceArn(r.eventSourceARN),
    }, context)
;

const processEncapsulatedMessage = async (ec: TypedMap, c: Config, context: any, r: Map) => {
    const body = JSON.parse(r.body);
    return consumeMessage(c, {
        receiptHandle: r.receiptHandle,
        rawMessage: body.Message,
        attributes: Object.entries(body.MessageAttributes).reduce((acc, [k, m]) => {
            acc[k] = (<Map>m).Value;
            return acc;
        }, {}),
        eventType: body.MessageAttributes.fullType.Value.toLowerCase().replace(/\./g, '_'),
        queueUrl: sqs.getQueueUrlFromEventSourceArn(r.eventSourceARN),
    }, context);
};

export default (ec: TypedMap, c: Config) => async (event: any, context: any): Promise<any[]> =>
    (!event.Records || !event.Records.length)
        ? []
        : Promise.all(event.Records.map(async r =>
            (r.messageAttributes && r.messageAttributes.fullType && r.messageAttributes.fullType.stringValue)
                ? processDirectMessage(ec, c, context, r)
                : processEncapsulatedMessage(ec, c, context, r)
        ))
;
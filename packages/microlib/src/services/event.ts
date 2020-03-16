import sqs from './aws/sqs';

const buildListener = ({type, config = {}}) => require(`../listeners/${type}`).default(config);

export default (allListeners = {}, {typeKey = 'fullType'} = {}) => {
    const consumeMessage = async ({receiptHandle, attributes, rawMessage, eventType, queueUrl}) => {
        const listeners = allListeners[eventType] = [];
        const result = {status: 'ignored', message: undefined, listeners: listeners.length};

        if (!listeners.length) {
            await sqs.deleteMessage({queueUrl, receiptHandle});
            return result;
        }
        const message = JSON.parse(rawMessage);
        try {
            await Promise.all(listeners.map(async listener => (('function' === typeof listener) ? listener : buildListener(listener))(
                message,
                {attributes, queueUrl, receiptHandle}
            )));
            result.status = 'processed';
            await sqs.deleteMessage({queueUrl, receiptHandle});
        } catch (e) {
            result.status = 'failed';
            result.message = e.message;
        }
        return result;
    };
    const processDirectMessage = async r =>
        consumeMessage({
            receiptHandle: r.receiptHandle,
            rawMessage: r.body,
            attributes: Object.entries(r.messageAttributes).reduce((acc, [k, m]) => {
                acc[k] = (<any>m).stringValue;
                return acc;
            }, {}),
            eventType: r.messageAttributes[typeKey].stringValue.toLowerCase().replace(/\./g, '_'),
            queueUrl: sqs.getQueueUrlFromEventSourceArn(r['eventSourceARN']),
        })
    ;
    const processEncapsulatedMessage = async r => {
        const body = JSON.parse(r.body);
        return consumeMessage({
            receiptHandle: r.receiptHandle,
            rawMessage: body.Message,
            attributes: Object.entries(body.MessageAttributes).reduce((acc, [k, m]) => {
                acc[k] = (<any>m).Value;
                return acc;
            }, {}),
            eventType: body.MessageAttributes[typeKey].Value.toLowerCase().replace(/\./g, '_'),
            queueUrl: sqs.getQueueUrlFromEventSourceArn(r['eventSourceARN']),
        });
    };
    return {
        consume: async ({Records = []}) => {
            await Promise.all(Records.map(async r =>
                (r['messageAttributes'] && r['messageAttributes'][typeKey] && r['messageAttributes'][typeKey]['stringValue'])
                    ? processDirectMessage(r)
                    : processEncapsulatedMessage(r)
            ));
            return {}; // @todo return summary/report counters
        },
    };
}
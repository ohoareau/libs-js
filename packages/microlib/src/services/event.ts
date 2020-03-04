import sqs from './aws/sqs';

const buildListener = ({type, config = {}}) => require(`../listeners/${type}`).default(config);

export default (allListeners = {}) => {
    const consumeMessage = async ({receiptHandle, attributes, rawMessage, eventType, queueUrl}) => {
        const listeners = allListeners[eventType] = [];
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
        await Promise.all(listeners.map(async listener => buildListener(listener)(
            message,
            {attributes, queueUrl, receiptHandle}
        )));
        result.status = 'processed';
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
            eventType: r.messageAttributes.fullType.stringValue.toLowerCase().replace(/\./g, '_'),
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
            eventType: body.MessageAttributes.fullType.Value.toLowerCase().replace(/\./g, '_'),
            queueUrl: sqs.getQueueUrlFromEventSourceArn(r['eventSourceARN']),
        });
    };
    return {
        consume: async ({Records = []}) => {
            await Promise.all(Records.map(async r =>
                (r['messageAttributes'] && r['messageAttributes']['fullType'] && r['messageAttributes']['fullType']['stringValue'])
                    ? processDirectMessage(r)
                    : processEncapsulatedMessage(r)
            ));
            return {}; // @todo return summary/report counters
        },
    };
}
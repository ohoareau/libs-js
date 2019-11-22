import AWS from 'aws-sdk';
import EventSourceBackendInterface from "@ohoareau/microservice/lib/EventSourceBackendInterface";
import {
    EventListener,
    EventListeners,
    EventSourceBackendConfig,
    Options,
    Service,
    TypeConfig
} from "@ohoareau/microservice/lib/types";

const sqs = new AWS.SQS();

export default class SqsEventSourceBackend implements EventSourceBackendInterface {
    private readonly service: Service;
    constructor(config: EventSourceBackendConfig, typeConfig: TypeConfig) {
        this.service = <Service>typeConfig.service;
    }
    async process(event: any, context: any, listeners: EventListeners, options: Options): Promise<any> {
        if (!event.Records || !event.Records.length) {
            return;
        }
        await Promise.all(event.Records.map(async r => {
            const receiptHandle = r.receiptHandle;
            const body = JSON.parse(r.body);
            const eventType = body.MessageAttributes.fullType.Value.toLowerCase().replace(/_/, '.');
            const splits = r.eventSourceARN.split(':');
            const queueUrl = sqs.endpoint.href + splits[4] + '/' + splits[5];
            if (listeners[eventType]) {
                const attributes = Object.keys(body.MessageAttributes).reduce((acc, k) => {
                    acc[k] = body.MessageAttributes[k].Value;
                    return acc;
                }, {});
                await (<EventListener>listeners[eventType])(
                    JSON.parse(body.Message),
                    {
                        attributes,
                        service: this.service,
                        context,
                        queueUrl,
                        receiptHandle,
                    }
                );
            }
            sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
        }));

    }
}
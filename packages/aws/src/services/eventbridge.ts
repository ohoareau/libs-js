const awseb = new (require('aws-sdk/clients/eventbridge'));

export type ebEvent = {
    type: string;
    bus?: string;
    data: object;
    source: string;
    time?: any;
    resources?: string[];
    traceHeader?: string;
}

async function putEvents(events: ebEvent[]) {
    return awseb.putEvents({Entries: events.map(e => ({
        Detail: JSON.stringify(e.data),
        DetailType: e.type,
        Source: `${process.env.EVENTBRIDGE_SOURCE_PREFIX || ''}${e.source}`,
        EventBusName: e.bus,
        Time: e.time,
        Resources: e.resources,
        TraceHeader: e.traceHeader,
    }))}).promise();
}

async function putEvent(event: ebEvent) {
    return putEvents([event]);
}

async function send(type: string, data: object, source: string, options?: Omit<ebEvent, 'type' | 'data' | 'source'>) {
    return putEvent({...options, type, data, source});
}

export const eventbridge = {
    send,
    putEvents,
    putEvent,
};


export default eventbridge;
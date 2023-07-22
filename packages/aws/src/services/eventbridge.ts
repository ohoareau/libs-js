const awseb = new (require('aws-sdk/clients/eventbridge'));

function defaultBigIntJsonSerialize(value: any) {
    if ('bigint' !== typeof value) return value;
    const s = value?.toString?.();
    if (s > String(Number.MAX_SAFE_INTEGER)) return s;
    return Number(s);
}

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
        Detail: JSON.stringify(e.data, ((key: string, value: any) => {
            // @ts-ignore
            if ('bigint' === typeof value && !BigInt.prototype.toJSON) return defaultBigIntJsonSerialize(value);
            return value;
        }) as any),
        DetailType: e.type,
        Source: `${process.env.EVENTBRIDGE_SOURCE_PREFIX || ''}${e.source}`,
        ...(e.bus ? {EventBusName: e.bus} : {}),
        ...(e.time ? {Time: e.time} : {}),
        ...((e.resources && e.resources.length) ? {Resources: e.resources} : {}),
        ...(e.traceHeader ? {TraceHeader: e.traceHeader} : {}),
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
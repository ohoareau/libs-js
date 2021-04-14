export type converted_record = {
    queueUrl: string,
    receiptHandle: string,
    message: any,
    messageAttributes: any,
};

export type consumer_report = {
    status: 'consumed' | 'ignored' | 'failed',
    queueUrl: string,
    receiptHandler: string,
    result: any,
};

export type message_report = {
    status: 'not-processed' | 'consumed' | 'ignored' | 'failed',
    queueUrl: string,
    receiptHandler: string,
    result: any,
};

export type consumer = {
    consume: (cr: converted_record, cf: config) => Promise<any>,
    supports: (cr: converted_record, cf: config) => boolean,
};

export type config = any;
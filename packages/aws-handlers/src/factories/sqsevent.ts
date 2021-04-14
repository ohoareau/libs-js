/*
import {config, consumer, consumer_report, converted_record, message_report} from "../types";

const {sqs} = require('@ohoareau/aws');
function convertRecord(record) {
    if (!record || !record.body) return undefined;
    const body = JSON.parse(record.body);
    const message = JSON.parse(body.Message);
    const messageAttributes = Object.entries(body.MessageAttributes).reduce((acc, [k, v]) => {
        switch (v.Type) {
            case 'String': v = v.Value; break;
            default: v = undefined; break;
        }
        acc[k] = v;
        return acc;
    }, {});

    return {
        queueUrl: sqs.getQueueUrlFromEventSourceArn(record.eventSourceARN),
        receiptHandle: record.receiptHandle,
        message,
        messageAttributes,
    };
}

async function markMessageStatus({status}) {
    switch (status) {
        case 'consumed':
        case 'ignored':
            return sqs.deleteMessage(infos);
        default:
            // message is not removed from the queue if an error occured
            break;
    }
}

async function executeConsumer(consumer: consumer, cr: converted_record, cf: config): Promise<consumer_report> {
    const report: consumer_report = {
        status: 'consumed',
        queueUrl: cr.queueUrl,
        receiptHandler: cr.receiptHandle,
        result: undefined,
    }
    try {
        return Object.assign(report, {result: await consumer.consume(cr, cf)});
    } catch (e) {
        return Object.assign(report, {status: 'failed', error: e})
    }
}

function mergeConsumersReports(report: consumer_report, mr: message_report): {status?: string} {
    const map = {
        'not-processed': {
            consumed: {status: 'consumed'},
            ignored: {status: 'ignored'},
            failed: {status: 'failed'},
        },
        consumed: {
            consumed: {},
            ignored: {},
            failed: {status: 'partiallyConsumed'},
        },
        ignored: {
            consumed: {status: 'consumed'},
            ignored: {},
            failed: {status: 'failed'},
        },
        failed: {
            consumed: {status: 'partiallyConsumed'},
            ignored: {},
            failed: {},
        },
        partiallyConsumed: {
            consumed: {},
            ignored: {},
            failed: {},
        },
        default: {
            default: {},
        },
    }
    return (map[mr.status] || map.default)[report.status] || map.default.default;
}

export default config => async ({Records: records = []}) => {
    return (await Promise.all(records.map(async record => {
        const convertedRecord = await convertRecord(record);
        if (!convertedRecord) return {status: 'ignored'};
        const consumers = (config.rules || []).filter(c => c.supports(convertedRecord));
        const messageReport: message_report = {
            status: 'not-processed',
            queueUrl: convertedRecord.queueUrl,
            receiptHandler: convertedRecord.receiptHandle,
            result: undefined,
        }
        return markMessageStatus(
            (await Promise.all(
                consumers.map(async c => executeConsumer(c, convertedRecord, config))
            )).reduce((acc: message_report, report: consumer_report) =>
                Object.assign(acc, mergeConsumersReports(report, acc))
            , messageReport) as message_report
        );
    }))).reduce((acc, r) => {

    }, {processed: 0, consumed: 0, partiallyConsumed: 0, failed: 0, ignored: 0, errors: {}});
};


 */

export default () => async () => {}
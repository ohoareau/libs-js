import ContextMessageEnvelop from '../src/ContextMessageEnvelop';
import Context from '../src/Context';

describe('ContextMessageEnvelop', () => {
    [
        ['existing full arn',
            {vars: {SNS_TOPIC_ZZZ_XXX_EVENTS_ARN: 'the-arn', SNS_TOPIC_ZZZ_EVENTS_ARN: 'the-arn-2', SNS_TOPIC_FALLBACK_EVENTS_ARN: 'the-arn-3'}}, {operation: 'xxx', service: 'zzz'}, {}, {},
            {
                TopicArn: 'the-arn',
                Message: {
                },
                MessageAttributes: {
                    service: {DataType: 'String', StringValue: 'zzz'},
                    operation: {DataType: 'String', StringValue: 'xxx'},
                },
            },
        ],
        ['existing service generic arn',
            {vars: {SNS_TOPIC_ZZZ_EVENTS_ARN: 'the-arn-2', SNS_TOPIC_FALLBACK_EVENTS_ARN: 'the-arn-3'}}, {operation: 'xxx', service: 'zzz'}, {}, {},
            {
                TopicArn: 'the-arn-2',
                Message: {
                },
                MessageAttributes: {
                    service: {DataType: 'String', StringValue: 'zzz'},
                    operation: {DataType: 'String', StringValue: 'xxx'},
                },
            },
        ],
        ['existing fallback arn',
            {vars: {SNS_TOPIC_FALLBACK_EVENTS_ARN: 'the-arn-3'}}, {operation: 'xxx', service: 'zzz'}, {}, {},
            {
                TopicArn: 'the-arn-3',
                Message: {
                },
                MessageAttributes: {
                    service: {DataType: 'String', StringValue: 'zzz'},
                    operation: {DataType: 'String', StringValue: 'xxx'},
                },
            },
        ],
    ]
        .forEach(([title, ctx, execCtx, extra, attributes, expectedValues]) => it(<string>title, () => {
            const m = new ContextMessageEnvelop(new Context(<any>ctx), new Context(<any>execCtx), <any>extra, <any>attributes);
            expect(m.toValues()).toEqual(expectedValues);
        }))
    ;
});

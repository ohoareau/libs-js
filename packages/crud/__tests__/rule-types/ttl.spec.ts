import { ttl } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

const mockDateNow = jest.spyOn(Date, 'now');

beforeEach(() => {
    jest.resetAllMocks();
});

describe('ttl', () => {
    [
        ['ttl',
            {}, ['@create'], 620, undefined, Date.parse('2019-06-14T10:00:00Z'),
            [matchingRule('@create', 'before', 'set ttl with a delay of 620 seconds from current date/time')],
            {ttl: Math.floor(Date.parse('2019-06-14T10:10:20Z') / 1000)},
        ],
        ['ttl with specified field name',
            {}, ['@create'], 620, 'someTtlFieldName', Date.parse('2019-06-14T10:00:00Z'),
            [matchingRule('@create', 'before', 'set someTtlFieldName as ttl with a delay of 620 seconds from current date/time')],
            {someTtlFieldName: Math.floor(Date.parse('2019-06-14T10:10:20Z') / 1000)},
        ],
    ].
        forEach(([title, data, operations, delay, field, now, expectedRules, expectedResult]) => it(<string>title, async () => {
            mockDateNow.mockReturnValueOnce(<any>now);
            await expectRule(
                ttl(<number>delay, <string>field),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

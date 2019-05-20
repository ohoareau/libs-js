import { timestamps } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

const mockDateNow = jest.spyOn(Date, 'now');

beforeEach(() => {
    jest.resetAllMocks();
});

describe('timestamps', () => {
    [
        ['timestamps for no operation do nothing',
            {}, [], Date.parse('2019-06-14T10:00:00Z'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            undefined,
        ],
        ['timestamps for unknown operation do nothing',
            {}, ['unknown'], Date.parse('2019-06-14T10:00:00Z'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            undefined,
        ],
        ['timestamps for creation - with utc timezone',
            {}, ['@create'], Date.parse('2019-06-14T10:00:00Z'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            {
                createdAt: new Date('2019-06-14T10:00:00Z').toISOString(),
                updatedAt: new Date('2019-06-14T10:00:00Z').toISOString(),
            },
        ],
        ['timestamps for creation - non-utc timezone',
            {}, ['@create'], Date.parse('2019-06-14T10:00:00+04:00'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            {
                createdAt: new Date('2019-06-14T10:00:00+04:00').toISOString(),
                updatedAt: new Date('2019-06-14T10:00:00+04:00').toISOString(),
            },
        ],
        ['timestamps for update - with utc timezone',
            {}, ['@update'], Date.parse('2019-06-15T10:00:00Z'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            {
                updatedAt: new Date('2019-06-15T10:00:00Z').toISOString(),
            },
        ],
        ['timestamps for update - non-utc timezone',
            {}, ['@update'], Date.parse('2019-06-15T10:00:00+04:00'),
            [matchingRule('@create|@update', 'before', 'set `createdAt` and/or `updatedAt` to current date/time')],
            {
                updatedAt: new Date('2019-06-15T10:00:00+04:00').toISOString(),
            },
        ],
    ].
        forEach(([title, data, operations, now, expectedRules, expectedResult]) => it(<string>title, async () => {
            mockDateNow.mockReturnValueOnce(<any>now);
            await expectRule(
                timestamps(),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

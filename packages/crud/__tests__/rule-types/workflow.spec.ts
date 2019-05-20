import { workflow } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

const mockDateNow = jest.spyOn(Date, 'now');

beforeEach(() => {
    jest.resetAllMocks();
});

describe('workflow', () => {
    [
        ['none set default value',
            {}, ['@create'], Date.parse('2019-06-15T10:00:00Z'), {}, 'status', {_: ['created']}, 'created', false,
            [
                matchingRule('@create', 'before', 'set status="created" if not provided (defaults)'),
                matchingRule('@create|@update', 'validate', 'check transition is allowed on `status` (steps: created, transitions: _=>created)'),
            ],
            {status: 'created'},
        ],
        ['none with timestamp enabled set default value and timestamp field',
            {}, ['@create'], Date.parse('2019-06-15T10:00:00Z'), {}, 'status', {_: ['created']}, 'created', true,
            [
                matchingRule('@create', 'before', 'set status="created" if not provided (defaults)'),
                matchingRule('@create|@update', 'validate', 'check transition is allowed on `status` (steps: created, transitions: _=>created)'),
                matchingRule('@create|@update', 'before', 'set `statusUpdatedAt` to current date/time when `status` changes'),
            ],
            {status: 'created', statusUpdatedAt: new Date('2019-06-15T10:00:00Z').toISOString()},
        ],
    ].
        forEach(([title, data, operations, now, ctxData, field, definition, defaultValue, timestamp, expectedRules, expectedResult]) => it(<string>title, async () => {
            mockDateNow.mockReturnValueOnce(<any>now);
            await expectRule(
                workflow(<string>field, <object>definition, <any>defaultValue, <boolean>timestamp),
                <object>data, <string[]>operations, expectedRules, expectedResult, <any>ctxData
            );
        }));
});

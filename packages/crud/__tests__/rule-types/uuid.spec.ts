import { uuid } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('uuid', () => {
    [
        ['default uuid',
            {}, ['@create'], undefined,
            [matchingRule('@create', 'before', 'set id="@uuid"')],
            {id: expect.stringMatching(/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i)},
        ],
        ['default uuid with field',
            {}, ['@create'], 'aaa',
            [matchingRule('@create', 'before', 'set aaa="@uuid"')],
            {aaa: expect.stringMatching(/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i)},
        ],
    ].
        forEach(([title, data, operations, field, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                <any>uuid(<string>field),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

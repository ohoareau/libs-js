import { features } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('features', () => {
    [
        ['default empty features',
            {}, ['@create'], undefined, undefined,
            [matchingRule('@create', 'before', 'set features={} if not provided (defaults)')],
            {features: {}},
        ],
        ['default non-empty features',
            {}, ['@create'], {c: true}, undefined,
            [matchingRule('@create', 'before', 'set features={"c":true} if not provided (defaults)')],
            {features: {c: true}},
        ],
        ['default empty features with specified field',
            {}, ['@create'], undefined, 'myField',
            [matchingRule('@create', 'before', 'set myField={} if not provided (defaults)')],
            {myField: {}},
        ],
        ['default non-empty features with specified field',
            {}, ['@create'], {a: true, b: true}, 'myField',
            [matchingRule('@create', 'before', 'set myField={"a":true,"b":true} if not provided (defaults)')],
            {myField: {a: true, b: true}},
        ],
    ].
        forEach(([title, data, operations, defaults, field, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                features(<any>defaults, <string>field),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

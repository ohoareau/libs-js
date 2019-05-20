import { tags } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('tags', () => {
    [
        ['default empty tags',
            {}, ['@create'], undefined, undefined,
            [matchingRule('@create', 'before', 'set tags=[] if not provided (defaults)')],
            {tags: []},
        ],
        ['default non-empty tags',
            {}, ['@create'], ['c'], undefined,
            [matchingRule('@create', 'before', 'set tags=["c"] if not provided (defaults)')],
            {tags: ['c']},
        ],
        ['default empty tags with specified field',
            {}, ['@create'], undefined, 'myField',
            [matchingRule('@create', 'before', 'set myField=[] if not provided (defaults)')],
            {myField: []},
        ],
        ['default non-empty tags with specified field',
            {}, ['@create'], ['a', 'b'], 'myField',
            [matchingRule('@create', 'before', 'set myField=["a","b"] if not provided (defaults)')],
            {myField: ['a', 'b']},
        ],
    ].
        forEach(([title, data, operations, defaults, field, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                tags(<string[]>defaults, <string>field),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

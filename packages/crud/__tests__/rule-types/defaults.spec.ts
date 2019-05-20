import { defaults } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('defaults', () => {
    [
        ['none',
            {}, ['@create'], {}, undefined, undefined, [], undefined
        ],
        ['statics',
            {}, ['@create'], {a: 12}, undefined, undefined,
            [matchingRule('@create', 'before', 'set a=12 if not provided (defaults)')],
            {a: 12}
        ],
        ['dynamics',
            {}, ['@create'], {a: () => 13}, undefined, undefined,
            [matchingRule('@create', 'before', 'set a if not provided (defaults)')],
            {a: 13}
        ],
        ['dynamics with prepared',
            {}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'hello', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            undefined,
            [matchingRule('@create', 'before', 'set a, b="hello", c if not provided (defaults)')],
            {a: 22, b: 'hello', c: 48}
        ],
        ['dynamics with prepared with context data',
            {data: {z: 34, t: 'world'}}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'hello', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            undefined,
            [matchingRule('@create', 'before', 'set a, b="hello", c if not provided (defaults)')],
            {a: 22, b: 'hello', c: 48, z: 34, t: 'world'}
        ],
        ['dynamics with prepared with context data and data not overridden',
            {data: {z: 34, t: 'world', b: 'hello'}}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'bye', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            undefined,
            [matchingRule('@create', 'before', 'set a, b="bye", c if not provided (defaults)')],
            {a: 22, b: 'hello', c: 48, z: 34, t: 'world'}
        ],
        ['dynamics with prepareCallback returning undefined',
            {}, ['@create'], {a: ({x}) => x, b: 'hello'}, () => undefined,
            undefined,
            [matchingRule('@create', 'before', 'set a, b="hello" if not provided (defaults)')],
            {a: undefined, b: 'hello'}
        ],
    ].
        forEach(([title, data, operations, defs, prepareCallback, forcedTitle, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                defaults(<any>defs, <any>prepareCallback, <string>forcedTitle),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

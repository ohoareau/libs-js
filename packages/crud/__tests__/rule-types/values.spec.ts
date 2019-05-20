import { values } from '../../src/rule-types';
import { expectRule, matchingRule } from "../utils";

describe('values', () => {
    [
        ['none (when empty object)',
            {}, ['@create'], {}, undefined, [], undefined
        ],
        ['none (when undefined)',
            {}, ['@create'], undefined, undefined, [], undefined
        ],
        ['statics',
            {}, ['@create'], {a: 12}, undefined,
            [matchingRule('@create', 'before', 'set a=12')],
            {a: 12},
        ],
        ['dynamics',
            {}, ['@create'], {a: () => 13}, undefined,
            [matchingRule('@create', 'before', 'set a')],
            {a: 13},
        ],
        ['dynamics with prepared',
            {}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'hello', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            [matchingRule('@create', 'before', 'set a, b="hello", c')],
            {a: 22, b: 'hello', c: 48},
        ],
        ['dynamics with prepared with context data',
            {data: {z: 34, t: 'world'}}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'hello', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            [matchingRule('@create', 'before', 'set a, b="hello", c')],
            {a: 22, b: 'hello', c: 48, z: 34, t: 'world'},
        ],
        ['dynamics with prepared with context data and data overridden',
            {data: {z: 34, t: 'world', b: 'hello'}}, ['@create'], {a: ({x, y}) => x + y + 5, b: 'bye', c: ({x}) => x * 4}, () => ({x: 12, y: 5}),
            [matchingRule('@create', 'before', 'set a, b="bye", c')],
            {a: 22, b: 'bye', c: 48, z: 34, t: 'world'},
        ],
        ['dynamics with prepareCallback returning undefined',
            {}, ['@create'], {a: ({x}) => x, b: 'hello'}, () => undefined,
            [matchingRule('@create', 'before', 'set a, b="hello"')],
            {a: undefined, b: 'hello'},
        ],
        ['dynamics with dynamic map',
            {}, ['@create'], () => ({a: ({x}) => x, b: 'hello'}), () => undefined,
            [matchingRule('@create', 'before', 'set')],
            {a: undefined, b: 'hello'},
        ],
    ].
        forEach(([title, data, operations, vals, prepareCallback, expectedRules, expectedResult]) => it(<string>title, async () => {
            await expectRule(
                values(<any>vals, <any>prepareCallback),
                <object>data, <string[]>operations, expectedRules, expectedResult
            );
        }));
});

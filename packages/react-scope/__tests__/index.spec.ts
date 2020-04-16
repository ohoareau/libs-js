import {applyRules} from '../src';

describe('applyRules', () => {
    [
        ['no rules with empty data return empty data',
            {data: {}}, [], {},
        ],
        ['no rules with non empty data return non empty data',
            {data: {a: 12, b: 'hello'}}, [], {a: 12, b: 'hello'},
        ],
        ['unknown rule with empty data return empty data',
            {data: {}}, [{type: 'someUnknownRule'}], {},
        ],
        ['unknown rule with non empty data return non empty data',
            {data: {a: 13, b: 'world'}}, [{type: 'someUnknownRule'}], {a: 13, b: 'world'},
        ],
        ['defaults rule with empty data and no data to populate return empty data',
            {data: {}}, [{type: 'defaults'}], {},
        ],
        ['defaults rule with empty data and data to populate with static values return non data',
            {data: {}}, [{type: 'defaults', data: {x: 12, y: 'bye'}}], {x: 12, y: 'bye'},
        ],
        ['defaults rule with non-empty data and data to populate with static values return merged data',
            {data: {z: 'hello'}}, [{type: 'defaults', data: {x: 12, y: 'bye'}}], {x: 12, y: 'bye', z: 'hello'},
        ],
        ['defaults rule with non-empty data and data to populate with static values return merged data without overriding existing values',
            {data: {z: 'hello'}}, [{type: 'defaults', data: {x: 12, y: 'bye', z: 'world'}}], {x: 12, y: 'bye', z: 'hello'},
        ],
        ['populate rule with empty data and no data to populate return empty data',
            {data: {}}, [{type: 'populate'}], {},
        ],
        ['populate rule with empty data and data to populate with static values return non data',
            {data: {}}, [{type: 'populate', data: {x: 12, y: 'bye'}}], {x: 12, y: 'bye'},
        ],
        ['populate rule with non-empty data and data to populate with static values return merged data',
            {data: {z: 'hello'}}, [{type: 'populate', data: {x: 12, y: 'bye'}}], {x: 12, y: 'bye', z: 'hello'},
        ],
        ['populate rule with non-empty data and data to populate with static values return merged data with existing values overridden',
            {data: {z: 'hello'}}, [{type: 'populate', data: {x: 12, y: 'bye', z: 'world'}}], {x: 12, y: 'bye', z: 'world'},
        ],
        ['populate rule with non-empty data and data to populate with dynamic values return merged data with existing values overridden',
            {data: {z: 'hello', t: {u: 'hello world'}}}, [{type: 'populate', data: {x: 12, y: '@t.u', z: 'world'}}], {x: 12, y: 'hello world', z: 'world', t: {u: 'hello world'}},
        ],
    ]
        .forEach(
            ([name, x, rules, expected]) => it(<string>name, () => {
                expect(applyRules(rules, x)).toEqual(expected);
            })
        )
    ;
});
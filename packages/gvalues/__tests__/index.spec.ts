import convert from '..';

describe('marshall', () => {
    [
        [{}, []],
        [{a: 1}, [{name: 'a', value: {type: 'int', intValue: 1}}]],
        [{x: "1", y: true, z: 12, t: .52}, [
            {name: 'x', value: {type: 'string', stringValue: "1"}},
            {name: 'y', value: {type: 'boolean', booleanValue: true}},
            {name: 'z', value: {type: 'int', intValue: 12}},
            {name: 't', value: {type: 'float', floatValue: .52}},
        ]],
        [{a: [1, 2, 13.5]}, [
            {name: 'a', values: [
                {name: 0, value: {type: 'int', intValue: 1}},
                {name: 1, value: {type: 'int', intValue: 2}},
                {name: 2, value: {type: 'float', floatValue: 13.5}},
            ]},
        ]],
        [{a: {x: {z: [1, 2, 13.5], t: 12}, p: true}, b: 4}, [
            {name: 'a', entries: [
                {name: 'x', entries: [
                        {name: 'z', values: [
                                {name: 0, value: {type: 'int', intValue: 1}},
                                {name: 1, value: {type: 'int', intValue: 2}},
                                {name: 2, value: {type: 'float', floatValue: 13.5}},
                            ]},
                        {name: 't', value: {type: 'int', intValue: 12}},
                    ]},
                {name: 'p', value: {type: 'boolean', booleanValue: true}},
            ]},
            {name: 'b', value: {type: 'int', intValue: 4}},
        ]],
    ]
        .forEach(([v, expected]) => it(`${JSON.stringify(v)} => ${JSON.stringify(expected)}`, () => {
            expect(convert(v)).toEqual(expected);
        }));
});

describe('unmarshall', () => {
    [
        [{}, []],
        [{a: 1}, [{name: 'a', value: {type: 'int', intValue: 1}}]],
        [{x: "1", y: true, z: 12, t: .52}, [
            {name: 'x', value: {type: 'string', stringValue: "1"}},
            {name: 'y', value: {type: 'boolean', booleanValue: true}},
            {name: 'z', value: {type: 'int', intValue: 12}},
            {name: 't', value: {type: 'float', floatValue: .52}},
        ]],
        [{a: [1, 2, 13.5]}, [
            {name: 'a', values: [
                    {name: 0, value: {type: 'int', intValue: 1}},
                    {name: 1, value: {type: 'int', intValue: 2}},
                    {name: 2, value: {type: 'float', floatValue: 13.5}},
                ]},
        ]],
        [{a: {x: {z: [1, 2, 13.5], t: 12}, p: true}, b: 4}, [
            {name: 'a', entries: [
                    {name: 'x', entries: [
                            {name: 'z', values: [
                                    {name: 0, value: {type: 'int', intValue: 1}},
                                    {name: 1, value: {type: 'int', intValue: 2}},
                                    {name: 2, value: {type: 'float', floatValue: 13.5}},
                                ]},
                            {name: 't', value: {type: 'int', intValue: 12}},
                        ]},
                    {name: 'p', value: {type: 'boolean', booleanValue: true}},
                ]},
            {name: 'b', value: {type: 'int', intValue: 4}},
        ]],
    ]
        .forEach(([expected, v]) => it(`${JSON.stringify(v)} => ${JSON.stringify(expected)}`, () => {
            expect(convert(v, true)).toEqual(expected);
        }));
});
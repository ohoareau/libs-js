import applyConditions, {applyCondition} from '..';

describe('applyConditions', () => {
    [
        ['undefined returns true',
            undefined, {}, true,
        ],
        ['no conditions returns true',
            {}, {}, true,
        ],
        ['no conditions returns true',
            {conditions: []}, {}, true,
        ],
        ['one satisfied condition returns true',
            {conditions: [
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 12},
            ]}, {item: {x: 12}}, true,
        ],
        ['one unsatisfied condition returns false',
            {conditions: [
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 13},
            ]}, {item: {x: 12}}, false,
        ],
        ['one satisfied condition and one unsatisfied condition returns false',
            {conditions: [
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 12},
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 13},
            ]}, {item: {x: 12}}, false,
        ],
        ['all satisfied conditions returns true',
            {conditions: [
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 12},
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 12},
            ]}, {item: {x: 12}}, true,
        ],
        ['all unsatisfied conditions returns true',
            {conditions: [
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 13},
                {type: 'attribute-comparison', name: 'x', operator: 'eq', value: 13},
            ]}, {item: {x: 12}}, false,
        ]
    ]
        .forEach(
            ([name, def, ctx, expected]: any) => it(name, () => {
                expect(applyConditions(def, ctx)).toEqual(expected);
            })
        )
    ;
});

describe('applyCondition', () => {
    [
        ['unknown condition type return false',
            {type: 'unknown'}, {}, false,
        ],
        ['attribute-comparison return true if same attribute value',
            {type: 'attribute-comparison', operator: 'eq', name: 'z', value: 'hello'}, {item: {z: 'hello'}}, true,
        ],
    ]
        .forEach(
            ([name, def, ctx, expected]: any) => it(name, () => {
                expect(applyCondition(def, ctx)).toEqual(expected);
            })
        )
    ;
    [
        ['x=12 eq 12 => true', {operator: 'eq', name: 'x', value: 12}, {x: 12}, true],
        ['x=12 eq 13 => false', {operator: 'eq', name: 'x', value: 13}, {x: 12}, false],
        ['x=12 in 12,13 => true', {operator: 'in', name: 'x', values: [12, 13]}, {x: 12}, true],
        ['x=13 in 12,13 => true', {operator: 'in', name: 'x', values: [12, 13]}, {x: 13}, true],
        ['x=14 in 12,13 => false', {operator: 'in', name: 'x', values: [12, 13]}, {x: 14}, false],
        ['x=12 gt 12 => false', {operator: 'gt', name: 'x', value: 12}, {x: 12}, false],
        ['x=12 gt 13 => false', {operator: 'gt', name: 'x', value: 13}, {x: 12}, false],
        ['x=12 ge 12 => true', {operator: 'ge', name: 'x', value: 12}, {x: 12}, true],
        ['x=12 ge 13 => false', {operator: 'ge', name: 'x', value: 13}, {x: 12}, false],
        ['x=12 lt 12 => false', {operator: 'lt', name: 'x', value: 12}, {x: 12}, false],
        ['x=12 lt 13 => true', {operator: 'lt', name: 'x', value: 13}, {x: 12}, true],
        ['x=12 le 12 => true', {operator: 'le', name: 'x', value: 12}, {x: 12}, true],
        ['x=12 le 13 => true', {operator: 'le', name: 'x', value: 13}, {x: 12}, true],
        ['x=12 ne 12 => false', {operator: 'ne', name: 'x', value: 12}, {x: 12}, false],
        ['x=12 ne 13 => true', {operator: 'ne', name: 'x', value: 13}, {x: 12}, true],
        ['x=12 ?? 13 => false', {operator: 'unknown', name: 'x', value: 13}, {x: 12}, false],
    ]
        .forEach(
            ([name, cond, item, expected]: any) => it(name, () => {
                expect(applyCondition({type: 'attribute-comparison', ...cond}, {item})).toEqual(expected);
            })
        )
    ;
});
import { buildQueryModifiers } from '../src/query';

describe('buildModifiers', () => {
    [
        ['', []],
        ['owner:eq:xxx', [{type: 'filter', attribute: 'owner'}, {type: 'eq', value: 'xxx'}]],
        ['owner:eq: abcd |admins:in: ax, b1', [{type: 'filter', attribute: 'owner'}, {type: 'eq', value: 'abcd'}, {type: 'or'}, {type: 'filter', attribute: 'admins'}, {type: 'in', values: ['ax', 'b1']}]],
//        ['"owner:eq:@id|admins:in:@id|members:in:@id|guests:in:@id"', []],
//        ['"owner:eq:@id|admins:in:@id|members:in:@id|guests:in:@id"', []],
//        ['"owner:eq:@id|admins:in:@id|members:in:@id|guests:in:@id"', []],
    ]
        .forEach(([string, expected]) => it(`${string} => ${JSON.stringify(expected)}`, () => {
            expect(buildQueryModifiers(string)).toEqual(expected);
        }))
    ;
});

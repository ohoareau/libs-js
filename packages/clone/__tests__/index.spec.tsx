import clone from '..';

describe('clone', () => {
    [
        [1, 1],
        [10.5, 10.5],
        [null, null],
        [undefined, undefined],
        [false, false],
        [true, true],
        ['', ''],
        [[], []],
        [[2, 3], [2, 3], v => v.push(23)],
        [{}, {}],
        [{}, {}, o => o.x = 12],
        [{a: 1}, {a: 1}, o => o.a = 2],
        [{id: 'abcde'}, {id: expect.any(String)}],
    ]
        .forEach(
            ([a, b, updater]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                const r = clone(a);
                // @ts-ignore
                updater && updater(a);
                expect(r).toEqual(b);
            })
        )
    ;
});
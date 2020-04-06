import diff from '..';

describe('diff', () => {
    [
        [{a: 1}, {a: 1}, {}],
        [{a: 1}, {a: 2}, {a: 2}],
        [{a: 1, b: 1}, {a: 3, b: 1}, {a: 3}],
        [[0, 2, 4], [0, 2, 4], []],
        [[0, 2, 4], 12, 12],
        [[0, 2, 4], [0, 2, 4, 8], [0, 2, 4, 8]],
        [{x: 1}, 34, 34],
        [true, true, undefined],
        [false, false, undefined],
        [true, false, false],
        [false, true, true],
        [{x: 2}, {_x: 1, x: 2}, {}],
    ]
        .forEach(
            ([a, b, c]) => it(`${JSON.stringify(a)} <> ${JSON.stringify(b)} => ${JSON.stringify(c)}`, () => {
                expect(diff(a, b)).toEqual(c);
            })
        )
    ;
});
import contents from '..';

describe('describe', () => {
    [
        [{}, {}, {contents: []}],
    ]
        .forEach(
            ([a, b, c]) => it(`${JSON.stringify(a)} + ${JSON.stringify(b)} => ${JSON.stringify(c)}`, () => {
                expect(contents(a, b)).toEqual(c);
            })
        )
    ;
});
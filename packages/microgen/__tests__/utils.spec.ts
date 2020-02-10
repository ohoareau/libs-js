describe('patterns', () => {
    [
        ['[!:$@&%()\\[\\];,/]+', '[tombuKtu2019', true],
    ]
        .forEach(
            ([pattern, value, expected]) => it(`/${pattern}/ ~ ${value} => ${expected ? 'TRUE' : 'FALSE'}`, () => {
                expect(new RegExp(<string>pattern).test(<string>value)).toEqual(expected);
            })
        )
});
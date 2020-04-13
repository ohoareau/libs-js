import {arrayize} from '..';

describe('arrayize', () => {
    [
        [null, [null]],
        [false, [false]],
        ['', ['']],
        [undefined, []],
        [[], []],
        [[1, 2, 3], [1, 2, 3]],
        ['hello', ['hello']],
    ]
        .forEach(
            ([a, b]) => it(`${JSON.stringify(a)} => ${JSON.stringify(b)}`, () => {
                expect(arrayize(a)).toEqual(b);
            })
        )
    ;
});
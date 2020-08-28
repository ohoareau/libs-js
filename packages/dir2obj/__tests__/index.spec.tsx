import dir2obj from '..';

describe('dir2obj', () => {
    [
        ['dir1', {}],
        ['dir2', {a: 'b'}],
        ['dir3', {x: {c: 'de', f: 12}, g: {h: {i: true, j: 'world'}}}],
        ['dir4', {x: {c: 'de', f: 12}, g: {h: {i: true, j: 'world'}}}],
        ['dir5', {something: {x: 12, y: {z: {t: false, u: 3.4}}, w: 'hello world'}}],
    ]
        .forEach(
            ([a, b]) => it(`${a} => ${JSON.stringify(b)}`, () => {
                expect(dir2obj(`${__dirname}/../__fixtures__/${a}`)).toEqual(b);
            })
        )
    ;
});
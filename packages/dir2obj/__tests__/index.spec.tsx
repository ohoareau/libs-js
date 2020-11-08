import dir2obj from '..';

describe('dir2obj', () => {
    [
        ['dir1', {}],
        ['dir2', {a: 'b'}],
        ['dir3', {x: {c: 'de', f: 12}, g: {h: {i: true, j: 'world'}}}],
        ['dir4', {x: {c: 'de', f: 12}, g: {h: {i: true, j: 'world'}}}],
        ['dir5', {something: {x: 12, y: {z: {t: false, u: 3.4}}, w: 'hello world'}}],
        ['dir6', new Error(`${__dirname}/../__fixtures__/dir6/a/b/c.yml: Plain value cannot start with reserved character @ at line 1, column 4:

a: @badvalue
   ^^^^^^^^^
`)],
        ['dir7', {plugins: ['plugin1', 'plugin2', 'plugin3', 'plugin4', 'plugin 4']}],
    ]
        .forEach(
            ([a, b]) => it(`${a} => ${JSON.stringify(b)}`, async () => {
                const f = async () => dir2obj(`${__dirname}/../__fixtures__/${a}`, {ignoreDots: true});
                if (b instanceof Error) {
                    await expect(f()).rejects.toThrow(b);
                } else {
                    await expect(f()).resolves.toEqual(b);
                }
            })
        )
    ;
});
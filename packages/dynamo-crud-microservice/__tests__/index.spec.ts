import microservice, { mutateQuery } from '..';

describe('', () => {
    it('', async () => {
        const m = microservice({type: 'Abcd', schema: {id: String}});
        expect(m).toBeDefined();
        expect(m.getAbcd).toBeDefined();
        expect(m.getAbcds).toBeDefined();
        expect(m.abcdService).toBeDefined();
    });
});

describe('mutateQuery', () => {
    [
        [undefined, {}, undefined],
        ['', {}, ''],
        ['a', {}, 'a'],
        ['abcd efgh ! @', {}, 'abcd efgh ! @'],
        ['@[id]', {}, ''],
        ['@[id]', {id: 12}, '12'],
        ['hello @[name]', {name: 'World'}, 'hello World'],
        ['hello @[name] <@[email]> !', {name: 'World', email: 'e@mail.com'}, 'hello World <e@mail.com> !'],
    ]
        .forEach(([s, vars, expected]) => it(`${s} + ${JSON.stringify(vars)} => ${expected}`, () => {
            expect(mutateQuery(<string|undefined>s, <{[key: string]: any}>vars)).toEqual(expected);
        }))
    ;
});

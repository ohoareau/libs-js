import generate from '..';

describe('generate', () => {
    it('', () => {
        expect(generate({type: 'generated', generator: 'letters'})).toEqual(expect.any(String));
    });
});
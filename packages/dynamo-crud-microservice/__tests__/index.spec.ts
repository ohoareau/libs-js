import microservice from '..';

describe('', () => {
    it('', async () => {
        const m = microservice({type: 'Abcd', schema: {id: String}});
        expect(m).toBeDefined();
        expect(m.getAbcd).toBeDefined();
        expect(m.getAbcds).toBeDefined();
    });
});

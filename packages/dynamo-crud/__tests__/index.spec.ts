import crud from '..';

describe('', () => {
    it('', async () => {
        const s = crud({type: 'Abcd', schema: {id: String}});
        expect(s).toBeDefined();
        expect(s.get).toBeDefined();
        expect(s.find).toBeDefined();
    });
});

const after = require('../../hooks/after');

describe('after', () => {
    it('execute', async () => {
        expect(await after()({}, undefined)).toEqual({});
    });
});
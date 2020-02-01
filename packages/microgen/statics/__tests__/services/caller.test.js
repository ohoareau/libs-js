const caller = require('../../services/caller');

describe('caller', () => {
    it('execute exists', async () => {
        expect('function' === typeof caller.execute).toBeTruthy();
    });
});
const migration = require('../../services/migration');

describe('migration', () => {
    it('migrate exists', async () => {
        expect('function' === typeof migration.migrate).toBeTruthy();
    });
});
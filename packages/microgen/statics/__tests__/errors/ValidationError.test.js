const ValidationError = require('../../errors/ValidationError');

describe('ValidationError', () => {
    it('throwable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new ValidationError({});
        } catch (e) {
            expect(e.message).toEqual("Validation error (0)\n\nerrors:\n  - ");
        }
    });
    it('serializable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new ValidationError({});
        } catch (e) {
            expect(e.serialize()).toEqual({
                data: {},
                errorInfo: {},
                errorType: 'validation',
                message: 'Validation error',
            });
        }
    });
});
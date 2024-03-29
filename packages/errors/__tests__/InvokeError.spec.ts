import InvokeError from '../src/InvokeError';

describe('InvokeError', () => {
    it('throwable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new InvokeError('theType', 'theOperation', 'theDsn', {a: 12}, {b: {c: 'hello'}});
        } catch (e) {
            expect(e.message).toEqual("Invoking operation 'theOperation' on service 'theType' raise an error when invoking 'theDsn': undefined (errorType: undefined)");
        }
    });
    it('serializable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new InvokeError('theType', 'theOperation', 'theDsn', {a: 12}, {b: {c: 'hello'}});
        } catch (e) {
            expect(e.serialize()).toEqual({
                code: 500,
                data: {},
                errorInfo: {
                    dsn: 'theDsn',
                    operation: 'theOperation',
                    type: 'theType',
                },
                errorType: 'invoke',
                message: "Invoking operation 'theOperation' on service 'theType' raise an error when invoking 'theDsn': undefined (errorType: undefined)",
            });
        }
    });
});
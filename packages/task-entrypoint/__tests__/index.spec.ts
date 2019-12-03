import entrypoint from '..';

describe('entrypoint', () => {
    it('noop', async () => {
        let actualCode;
        await entrypoint('noop', {}, {env: {NO_NOTIFY: 1}, exit: code => actualCode = code});
        expect(actualCode).toEqual(0);
    });
    it('custom step', async () => {
        let actualCode;
        await entrypoint('my-step', {
            "my-step": () => actualCode = 3,
        }, {env: {NO_NOTIFY: 1}, exit: code => actualCode = `${actualCode} - ${code}`});
        expect(actualCode).toEqual('3 - 0');
    });
    it('default result', async () => {
        let actualResult;
        await entrypoint('result', {}, {
            failure: (error, cause) => actualResult = `failure: ${error} - ${cause}`,
            success: result => actualResult = result,
            exit: () => {},
            log: () => {},
        });
        expect(actualResult).toEqual({});
    });
});
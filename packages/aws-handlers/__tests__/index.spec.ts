import createHandler from '..';

describe('createHandler', () => {
    it('throw an error if unknown handler type', () => {
        expect(() => createHandler('unknown')).toThrow(new Error("Uknown handler type 'unknown'"));
    });
    it('return a function for known handler type', () => {
        expect(typeof createHandler('s3event')).toEqual('function');
    });
});

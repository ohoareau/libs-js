import createHandler, {s3eventHandler} from '..';

describe('createHandler', () => {
    it('throw an error if unknown handler type', () => {
        expect(() => createHandler('unknown')).toThrow(new Error("Unknown handler type 'unknown'"));
    });
    it('return a function for known handler type', () => {
        expect(typeof createHandler('s3event')).toEqual('function');
    });
});

describe('s3eventHandler', () => {
    it('is a function', () => {
        expect(typeof s3eventHandler).toEqual('function');
    });
});

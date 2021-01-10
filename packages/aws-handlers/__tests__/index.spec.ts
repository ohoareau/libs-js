import createHandler, {createS3eventHandler} from '..';

describe('createHandler', () => {
    it('throw an error if unknown handler type', () => {
        expect(() => createHandler('unknown')).toThrow(new Error("Unknown handler type 'unknown'"));
    });
    it('return a function for known handler type', () => {
        expect(typeof createHandler('s3event')).toEqual('function');
    });
});

describe('createS3eventHandler', () => {
    it('return a function', () => {
        expect(typeof createS3eventHandler({})).toEqual('function');
    });
});

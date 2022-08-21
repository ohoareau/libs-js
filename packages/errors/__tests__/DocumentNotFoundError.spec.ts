import DocumentNotFoundError from '../src/DocumentNotFoundError';

describe('DocumentNotFoundError', () => {
    it('throwable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new DocumentNotFoundError('theType', 'theId');
        } catch (e) {
            expect(e.message).toEqual("Unknown theType 'theId'");
        }
    });
    it('throwable with custom field name', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new DocumentNotFoundError('theType', 'theId', 'theField');
        } catch (e) {
            expect(e.message).toEqual("Unknown theType with theField is 'theId'");
        }
    });
    it('id is not a string', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new DocumentNotFoundError('theType', ['theNon', 'StringId']);
        } catch (e) {
            expect(e.message).toEqual("Unknown theType '[\"theNon\",\"StringId\"]'");
        }
    });
    it('serializable', async () => {
        try {
            // noinspection ExceptionCaughtLocallyJS
            throw new DocumentNotFoundError('theType2', 'theId2');
        } catch (e) {
            expect(e.serialize()).toEqual({
                code: 404,
                data: {},
                errorInfo: {
                    id: 'theId2',
                    type: 'theType2',
                    key: 'id',
                    value: 'theId2',
                },
                errorType: 'document-not-found',
                message: "Unknown theType2 'theId2'",
            });
        }
    });
});
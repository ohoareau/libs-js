import Format1_0 from '../../src/formats/Format1_0';
import ValidationError from '../../src/errors/ValidationError';

describe('validate', () => {
    it('do not throw errors if empty definition', () => {
        const format = new Format1_0();
        expect(() => format.validate({})).not.toThrow();
    });
    it('throw error if one model but no type for it', () => {
        const format = new Format1_0();
        const expectedError = new ValidationError([
            {path: 'field1', error: new Error('Missing type for field')},
        ]);
        expect(() => format.validate({
            models: {
                field1: {},
            }

        })).toThrow(expectedError);
    });
});
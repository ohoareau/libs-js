import {validate} from '../src';

describe('validate', () => {
    it('throw error for object with no format version', () => {
        expect(() => validate({})).toThrowError(new Error('No format version specified'));
    });
    it('do not throw errors if known format specified but no other definition', () => {
        expect(() => validate({format: '1.0'})).not.toThrow();
    });
    it('throw error if format specified but unknown format', () => {
        expect(() => validate({format: '0.0'})).toThrow(new Error('Unknown format version 0.0'));
    });
    it('throw error if underlying format validation throw error', () => {
        expect(() => validate({
            format: '1.0',
            models: {field1: {}},
        })).toThrow(new Error('Validation error (1 violation)'));
    });
});
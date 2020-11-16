jest.mock('../src/formats', () => ({
    __esModule: true,
    default: {
        '9.9': class {validate(){}},
    }
}));

import {validate} from '../src';

describe('validate', () => {
    it('throw error for object with no format version', () => {
        expect(() => validate({})).toThrowError(new Error('No format version specified'));
    });
    it('throw error if format specified but unknown format', () => {
        expect(() => validate({format: '0.0'})).toThrow(new Error('Unknown format version 0.0'));
    });
    it('pass on ', () => {
        expect(() => validate({format: '9.9'})).not.toThrow();
    });
});
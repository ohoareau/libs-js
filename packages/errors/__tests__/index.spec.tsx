import {AbstractError, InvokeError} from '../src';

describe('exports are defined', () => {
    [
        ['AbstractError', AbstractError],
        ['InvokeError', InvokeError],
    ].forEach(
        (([name, value]) => it(`export ${name} is defined`, () => {
            expect(value).toBeDefined();
        }))
    );
});
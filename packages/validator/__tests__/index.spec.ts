import * as validators from '..';
import i18n from 'i18next';

// to enable key name as fallback values
beforeAll(async () => i18n.init());

describe('validator', () => {
    [
        ['fax', '0123a', 'constraints_fax'],
        ['fax', '0102030405', undefined],
        ['anything', 'Xy9 ,_z', undefined]
    ]
        .forEach(
            ([a, b, c]) => it(`${JSON.stringify(b)} is ${a} ? ${JSON.stringify(c)}`, () => {
                expect(validators[<string>a](b)).toEqual(c);
            })
        )
    ;
});
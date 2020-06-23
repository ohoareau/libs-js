import {convertSvgFileNameToReactComponentFileName} from '../src';

describe('convertSvgFileNameToReactComponentFileName', () => {
    [
        ['logo.svg', 'Logo.tsx'],
        ['close.svg', 'Close.tsx'],
        ['a/b/c/logo.svg', 'Logo.tsx'],
        ['De-f/Fgg-g/logo.svg', 'Logo.tsx'],
        ['../../assets/svgs/logo.svg', 'Logo.tsx'],
    ]
        .forEach(
            ([a, b]) => it(`${a} => ${b}`, () => {
                expect(convertSvgFileNameToReactComponentFileName(a)).toEqual(b);
            })
        )
    ;
});
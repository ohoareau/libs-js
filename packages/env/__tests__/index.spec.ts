import env from '../src';

describe('env', () => {
    [
        ['THIS_IS_AN_UNKNOWN_PREFIX', undefined, ''],
        ['REACT_APP_', {
            REACT_APP_XYZ: 12,
            REACT_APP_UV_WXYZ: 'hello world',
            REACT_APP_UV_WXYZT: 'hello;world',
            ABC: 1,
            X_Y_Z: 'world',
            THIS_IS_REACT_APP_X: 'bye',
            REACT_APP_C: false,
        }, `
REACT_APP_XYZ=12
REACT_APP_UV_WXYZ="hello world"
REACT_APP_UV_WXYZT="hello;world"
REACT_APP_C=
        `
        ],
        [undefined, {A: 1, BB: 'hello'}, `
A=1
BB=hello
        `]
    ]
        .forEach(
            ([prefix, envs, expected]: any) => it(`${prefix} ~ * => .`, () => {
                expect(env(prefix, envs)).toEqual(expected.trim());
            })
        )
    ;
});
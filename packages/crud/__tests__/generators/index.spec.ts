import * as generators from '../../src/generators';

describe('generators', () => {
    ['generate2C2D', 'generate3C3D', 'generateUuid'].forEach(t => it(`generator '${t}' is available`, () => {
        expect(generators.hasOwnProperty(t) && 'function' === typeof generators[t]).toBeTruthy();
    }));
});

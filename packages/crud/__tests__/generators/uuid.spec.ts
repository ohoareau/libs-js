import generateUuid from '../../src/generators/uuid';

describe('generateUuid', () => {
    it('generate a valid string', () => {
        expect(generateUuid()).toMatch(/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i);
    });
    it('generate different string on each call', () => {
        const a = generateUuid();
        const b = generateUuid();
        const c = generateUuid();
        expect(a).not.toEqual(b);
        expect(b).not.toEqual(c);
        expect(c).not.toEqual(a);
    });
});

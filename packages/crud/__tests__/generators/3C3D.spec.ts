import generate3C3D from '../../src/generators/3C3D';

describe('generate3C3D', () => {
    it('generate a valid string', () => {
        expect(generate3C3D()).toMatch(/^[A-Z]{3}[0-9]{3}$/);
    });
    it('generate different string on each call', () => {
        const a = generate3C3D();
        const b = generate3C3D();
        const c = generate3C3D();
        expect(a).not.toEqual(b);
        expect(b).not.toEqual(c);
        expect(c).not.toEqual(a);
    });
});

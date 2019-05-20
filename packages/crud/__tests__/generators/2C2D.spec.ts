import generate2C2D from '../../src/generators/2C2D';

describe('generate2C2D', () => {
    it('generate a valid string', () => {
        expect(generate2C2D()).toMatch(/^[A-Z]{2}[0-9]{2}$/);
    });
    it('generate different string on each call', () => {
        const a = generate2C2D();
        const b = generate2C2D();
        const c = generate2C2D();
        expect(a).not.toEqual(b);
        expect(b).not.toEqual(c);
        expect(c).not.toEqual(a);
    });
});

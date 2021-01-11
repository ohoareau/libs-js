import createTopper from '..';

describe('createTopper', () => {
    it('returns an objet with start, stop and duration', () => {
        expect(createTopper()).toEqual({
            start: expect.any(Function),
            stop: expect.any(Function),
            fail: expect.any(Function),
            duration: expect.any(Function),
        })
    });
});

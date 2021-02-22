import service from '../../src/services/order';

beforeEach(() => {
    jest.resetAllMocks();
})

describe('create', () => {
    it('for missing data throw an error', async () => {
        await expect(service.create({})).rejects.toThrow(new Error('Missing data'));
    })
})
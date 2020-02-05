jest.mock('../../services/diffdb');

const diffdbServiceMock = require('../../services/diffdb');
const diffdb = require('../../backends/diffdb');

beforeAll(() => {
    jest.resetAllMocks();
});

describe('diffdb', () => {
    it('return initialized diffdb db', async () => {
        const expected = {};
        diffdbServiceMock.getDb.mockReturnValue(expected);
        expect(diffdb({name: 'modelName'})).toEqual(expected);
        expect(diffdbServiceMock.getDb).toHaveBeenCalledWith({name: 'modelName'});
    });
});
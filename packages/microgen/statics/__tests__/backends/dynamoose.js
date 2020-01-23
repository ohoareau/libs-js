jest.mock('../../services/dynamoose');

const dynamooseServiceMock = require('../../services/dynamoose');
const dynamoose = require('../../backends/dynamoose');

beforeAll(() => {
    jest.resetAllMocks();
});

describe('dynamoose', () => {
    it('return initialized dynamoose db', async () => {
        const expected = {};
        dynamooseServiceMock.getDb.mockReturnValue(expected);
        expect(dynamoose({name: 'modelName'})).toEqual(expected);
        expect(dynamooseServiceMock.getDb).toHaveBeenCalledWith({
            name: 'modelName', schema: {}, schemaOptions: {}, options: {create: false, update: false, waitForActive: false}
        });
    });
});
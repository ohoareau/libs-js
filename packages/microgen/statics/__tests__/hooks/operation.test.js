jest.mock('../../services/caller');

const callerServiceMock = require('../../services/caller');
const operation = require('../../hooks/operation');

describe('operation', () => {
    it('execute', async () => {
        callerServiceMock.execute.mockResolvedValue({});
        expect(await operation({operation: 'op', params: {p: 1}})({id: 'abcd'})).toEqual({id: 'abcd'});
    });
});
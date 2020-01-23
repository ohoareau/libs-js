jest.mock('../../services/aws/cognito');

const cognitoServiceMock = require('../../services/aws/cognito');
const cognitoUserDelete = require('../../hooks/cognito-user-delete');

describe('cognito-user-delete', () => {
    it('execute', async () => {
        cognitoServiceMock.deleteUser.mockResolvedValue({});
        expect(await cognitoUserDelete({userPool: 'up'})({id: 'abcd'})).toEqual({id: 'abcd'});
    });
});
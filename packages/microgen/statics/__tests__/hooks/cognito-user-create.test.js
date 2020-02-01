jest.mock('../../services/aws/cognito');

const cognitoServiceMock = require('../../services/aws/cognito');
const cognitoUserCreate = require('../../hooks/cognito-user-create');

describe('cognito-user-create', () => {
    it('execute', async () => {
        cognitoServiceMock.createUser.mockResolvedValue({id: 'id1', username: 'username1'});
        cognitoServiceMock.addUserToGroupsByUsername.mockResolvedValue({});
        expect(await cognitoUserCreate({userPool: 'up', group: 'g1', adminGroup: 'g2'})({})).toEqual({
            id: 'id1',
        });
    });
});
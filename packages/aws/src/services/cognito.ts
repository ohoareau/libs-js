const awscog = new (require('aws-sdk/clients/cognitoidentityserviceprovider'));

const createUser = async ({userPool, username, attributes}) => {
    const response = await awscog.adminCreateUser({
        UserPoolId: userPool,
        Username: username,
        DesiredDeliveryMediums: ['EMAIL'],
        ForceAliasCreation: false,
        UserAttributes: (Object.entries(attributes).reduce((acc, [k, v]) => {
            acc.push({Name: k, Value: ('boolean' === typeof v) ? (!!v ? 'True' : 'False') : v});
            return acc;
        }, <any[]>[])),
    }).promise();
    return Object.assign({}, {
        ...response.User,
        id: response.User.Attributes.find(a => a.Name === 'sub').Value,
        username: response.User.Username,
    });
};
const addUserToGroupByUsername = async ({group, userPool, username}) => awscog.adminAddUserToGroup({
    GroupName: group, UserPoolId: userPool, Username: username,
}).promise();
const addUserToGroupsByUsername = async ({userPool, groups, username}) =>
    Promise.all(groups.map(async group => addUserToGroupByUsername({group, userPool, username})));

const getUser = async ({userPool, id}) => {
    const { Users: users } = await awscog.listUsers({
        UserPoolId: userPool, Filter: `sub = "${id}"`, Limit: 1,
    }).promise();
    if (!users || !users.length) throw new Error(`Unknown user '${id}'`);
    const user = users[0];
    user.id = id;
    user.username = user.Username;
    return user;
};
const deleteUserByUsername = async ({userPool, username}) =>
    awscog.adminDeleteUser({UserPoolId: userPool, Username: username}).promise()
;
const deleteUser = async ({userPool, id}) =>
    deleteUserByUsername({userPool, username: (await getUser({userPool, id})).username})
;

export const cognito = {
    createUser,
    addUserToGroupByUsername,
    addUserToGroupsByUsername,
    getUser,
    deleteUser,
    deleteUserByUsername,
}

export default cognito
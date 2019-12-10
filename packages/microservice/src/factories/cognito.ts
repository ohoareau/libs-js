import AWS from 'aws-sdk';
import {Map} from '..';
const cognito = new AWS.CognitoIdentityServiceProvider();

export type User = Map & {
    id: string,
    username: string,
}

export default () => {
    const createUser = async ({userPool, username, attributes}: {userPool: string, username: string, attributes: Map}): Promise<User> => {
        const response = await cognito.adminCreateUser({
            UserPoolId: userPool,
            Username: username,
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
            UserAttributes: (Object.entries(attributes).reduce((acc, [k, v]) => {
                acc.push({Name: k, Value: ('boolean' === typeof v) ? (!!v ? 'True' : 'False') : v});
                return acc;
            }, <any[]>[])),
        }).promise();
        return <User>Object.assign({}, {
            ...(<any>response).User,
            id: (<any>response).User.Attributes.find(a => a.Name === 'sub').Value,
            username: (<any>response).User.Username,
        });
    };
    const addUserToGroupByUsername = async ({group, userPool, username}) => cognito.adminAddUserToGroup({
        GroupName: group, UserPoolId: userPool, Username: username,
    }).promise();
    const addUserToGroupsByUsername = async ({userPool, groups, username}) =>
        Promise.all(groups.map(async group => addUserToGroupByUsername({group, userPool, username})));

    const getUser = async ({userPool, id}): Promise<User> => {
        const { Users: users } = await cognito.listUsers({
            UserPoolId: userPool, Filter: `sub = "${id}"`, Limit: 1,
        }).promise();
        if (!users || !users.length) throw new Error(`Unknown user '${id}'`);
        const user = <any>users[0];
        user.id = id;
        user.username = <string>user.Username;
        return <User>user;
    };
    const deleteUserByUsername = async ({userPool, username}): Promise<any> =>
        cognito.adminDeleteUser({UserPoolId: userPool, Username: username}).promise()
    ;
    const deleteUser = async ({userPool, id}): Promise<any> =>
        deleteUserByUsername({userPool, username: (await getUser({userPool, id})).username})
    ;
    return {
        createUser,
        addUserToGroupByUsername,
        addUserToGroupsByUsername,
        getUser,
        deleteUser,
        deleteUserByUsername,
    };
};
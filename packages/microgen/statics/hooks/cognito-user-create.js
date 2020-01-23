const cognito = require('../services/aws/cognito');

module.exports = ({userPool, group, adminGroup}) => async data => {
    const attributes = {
        email: data.email,
        email_verified: true,
    };
    if (data.phone) {
        attributes.phone_number = data.phone;
        attributes.phone_number_verified = true;
    }
    const user = await cognito.createUser({
        userPool: userPool,
        username: data.email,
        attributes,
    });
    data.id = user.id;
    const groups = group ? [group] : [];
    data.admin && adminGroup && groups.push(adminGroup);
    await cognito.addUserToGroupsByUsername({userPool, username: user.username, groups});
    return data;
};
const cognito = require('../services/aws/cognito');

module.exports = ({userPool}) => async data => {
    await cognito.deleteUser({userPool, id: data.id});
    return data;
};
const sfn = require('../services/aws/sfn');

module.exports = ({o, stateMachine, input}) => async data => {
    await sfn.startExecution({stateMachine, input: input || data, namePrefix: `${o.replace(/_/g, '-')}-`});
    return data;
};
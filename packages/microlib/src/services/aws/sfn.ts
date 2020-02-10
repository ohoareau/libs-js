import uuid from 'uuid/v4';
const stepfunctions = new (require('aws-sdk/clients/stepfunctions'));

export default {
    startExecution: async ({stateMachine, input, namePrefix}) => stepfunctions.startExecution({
            stateMachineArn: stateMachine,
            input: JSON.stringify(input),
            name: `${namePrefix}-${uuid()}`,
        }).promise()
    ,
}
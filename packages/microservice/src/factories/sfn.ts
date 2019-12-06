import AWS from 'aws-sdk';
import uuid from 'uuid/v4';

const stepfunctions = new AWS.StepFunctions();

export default () => ({
    startExecution: async ({stateMachine, input, namePrefix}) => stepfunctions.startExecution({
            stateMachineArn: stateMachine,
            input: JSON.stringify(input),
            name: `${namePrefix}-${uuid()}`,
        }).promise()
    ,
});
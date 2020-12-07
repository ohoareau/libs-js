import {v4 as uuid} from 'uuid';
const awssfn = new (require('aws-sdk/clients/stepfunctions'));

export const sfn = {
    startExecution: async ({stateMachine, input, namePrefix}) => awssfn.startExecution({
            stateMachineArn: stateMachine,
            input: JSON.stringify(input),
            name: `${namePrefix}-${uuid()}`,
        }).promise()
    ,
}

export default sfn
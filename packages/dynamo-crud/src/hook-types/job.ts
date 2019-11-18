import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';

const stepfunctions = new AWS.StepFunctions();

export default def => async ctx => {
    const inputBuilder = (def.input && def.input.apply) ? def.input : () => def.input;
    await stepfunctions.startExecution({
        stateMachineArn: def.stateMachine,
        input: JSON.stringify(await inputBuilder(ctx) || {}),
        name: `${ctx.type}-${ctx.operation}-${uuidv4()}`,
    }).promise();
};
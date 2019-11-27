import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import {Config} from "../..";

const stepfunctions = new AWS.StepFunctions();

export default (cfg, c: Config) => async (action) => {
    const inputBuilder = (cfg.input && cfg.input.apply) ? cfg.input : async (action) => cfg.input || await action.res.result || action.req;
    await stepfunctions.startExecution({
        stateMachineArn: cfg.stateMachine,
        input: JSON.stringify(await inputBuilder(action) || {}),
        name: `${c.full_type}-${action.req.operation}-${uuidv4()}`,
    }).promise();
};
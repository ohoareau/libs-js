import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import {Config, Definition} from "../..";

const stepfunctions = new AWS.StepFunctions();

export default (hc: Definition, c: Config) => async (action) => {
    const cfg = hc.config || {};
    const inputBuilder = (cfg.input && cfg.input.apply) ? cfg.input : async (action) => cfg.input || await action.res.result || action.req;
    await stepfunctions.startExecution({
        stateMachineArn: cfg.stateMachine,
        input: JSON.stringify(await inputBuilder(action) || {}),
        name: `${c.type}-${action.req.operation}-${uuidv4()}`,
    }).promise();
};
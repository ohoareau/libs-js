import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import {Definition} from "../..";

const stepfunctions = new AWS.StepFunctions();

export default (hc: Definition) => async (ctx, action) => {
    const cfg = hc.config || {};
    if (cfg.condition && !cfg.condition(ctx)) return;
    const inputBuilder = (cfg.input && cfg.input.apply) ? cfg.input : async () => cfg.input || await action.res.result || action.req;
    await stepfunctions.startExecution({
        stateMachineArn: cfg.stateMachine,
        input: JSON.stringify(await inputBuilder(ctx) || {}),
        name: `${ctx.config.type}-${action.req.operation}-${uuidv4()}`,
    }).promise();
};
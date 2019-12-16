import {Config} from "../..";
import sfnFactory from '../../factories/sfn';

const sfn = sfnFactory();

export default (cfg, c: Config) => async (action) => sfn.startExecution({
    stateMachine: cfg.stateMachine,
    input: await ((cfg.input && cfg.input.apply) ? cfg.input : async (action) => cfg.input || (cfg.usePayloadData ? action.req.payload.data : (await action.res.result || action.req)))(action) || {},
    namePrefix: `${c.full_type}-${action.req.operation}-`,
});
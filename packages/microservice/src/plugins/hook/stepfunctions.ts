import {Config} from "../..";
import sfnFactory from '../../factories/sfn';

const sfn = sfnFactory();

export default (cfg, c: Config) => async (action) => {
    const input = await ((cfg.input && cfg.input.apply) ? cfg.input : async (action) => cfg.input || (cfg.usePayloadData ? action.req.payload.data : (await action.res.result || action.req)))(action) || {};
    if (cfg.ensureKeys && Array.isArray(cfg.ensureKeys)) {
        cfg.ensureKeys.reduce((acc, k) => {
            acc[k] = acc.hasOwnProperty(k) ? acc[k] : '';
            return acc;
        }, input);
    }
    return sfn.startExecution({
        stateMachine: cfg.stateMachine,
        input,
        namePrefix: `${c.full_type}-${action.req.operation}-`,
    });
}
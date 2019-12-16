import {Config} from "../..";
import snsFactory from "../../factories/sns";

export default (cfg, c: Config) => {
    const sns = snsFactory();
    return async (action) => sns.publish({
        message: cfg.usePayloadData ? action.req.payload.data : action.res.result,
        attributes: {
            fullType: `${c.full_type}_${action.req.operation}`,
            type: c.full_type,
            operation: action.req.operation,
        },
        topic: cfg.topic,
    });
}
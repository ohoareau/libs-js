import {Config} from "../..";
import snsFactory from "../../factories/sns";

export default (cfg, c: Config) => {
    const sns = snsFactory();
    return async (action) => sns.publish({
        message: action.res.result,
        attributes: {
            fullType: `${c.full_type}_${action.req.operation}`,
            type: c.full_type,
            operation: action.req.operation,
        },
        topic: process.env.MICROSERVICE_OUTGOING_TOPIC_ARN,
    });
}
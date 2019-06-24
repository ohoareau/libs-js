import {rule} from "./rule";
import Context from "../Context";
import ContextMessageEnvelop from "../ContextMessageEnvelop";

export const publish = (operation: string|string[], extra: {[k: string]: any} = {}, attributes: {[k: string]: any} = {}) => {
    return rule(operation, 'publish', `publish generic platform event`, async (ctx: Context, execCtx: Context) => {
        const sns = new (require('aws-sdk').SNS)();
        sns.publish(new ContextMessageEnvelop(ctx, execCtx, extra, attributes).toJson()).promise()
    });
};
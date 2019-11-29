import {Config} from "../../index";

export default (ctx: {config: Config}) => next => async (action) => {
    try {
        return await next(action); // await is important here
    } catch (e) {
        action.res.result = ctx.config.serializeError(e);
        return action;
    }
}
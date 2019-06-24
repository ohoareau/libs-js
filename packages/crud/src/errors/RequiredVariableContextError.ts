import ContextError from './ContextError';
import Context from "../Context";

export default class RequiredVariableContextError extends ContextError {
    constructor(key: string|string[], ctx: Context, data: object = {}) {
        key = Array.isArray(key) ? key : [key];
        super('vars', 'variable.required', {...data, key, context: ctx});
    }
}

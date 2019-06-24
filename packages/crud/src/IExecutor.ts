import Context from "./Context";
import Rule from "./Rule";

export default interface IExecutor {
    execute(ctx: Context, rules: Rule[], action: Function): Promise<any>;
    execute(ctx: Context, rules: Rule[], action: Function, prePopulate: Function|undefined): Promise<any>;
}

import Context from "./Context";
import Rule from "./Rule";

export default interface IExecutor {
    execute(rules: Rule[], data: object, operations: string[], action: Function): Promise<any>;
    execute(rules: Rule[], data: object, operations: string[], action: Function, prePopulate: Function|undefined): Promise<any>;
    execute(rules: Rule[], data: object, operations: string[], action: Function, prePopulate: Function|undefined, ctx: Context|undefined): Promise<any>;
}

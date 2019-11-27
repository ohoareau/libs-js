import {Map, TypedMap} from "../..";
import lambdaFactory from "../../factories/lambda";

export default (lc: TypedMap) => {
    const lambda = lambdaFactory();
    return async (operation: string, payload: Map, options: Map = {}): Promise<any> =>
        lambda.execute(lc.arn, payload, options)
    ;
};
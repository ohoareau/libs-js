import {Map} from "../..";

export default def => async (operation: string, payload: Map, options: Map = {}): Promise<any> =>
    def.config.callback(operation, payload, options)
;
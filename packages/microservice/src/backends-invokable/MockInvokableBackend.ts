import InvokableBackendInterface from "../InvokableBackendInterface";
import {InvokableBackendConfig, InvokePayload, Options, TypeConfig} from "../types";

export type Call = {
    operation: string,
    payload: InvokePayload,
    options: Options,
}

export default class MockInvokableBackend implements InvokableBackendInterface {
    private readonly calls: Call[];
    constructor(config: InvokableBackendConfig, typeConfig: TypeConfig) {
        this.calls = [];
    }
    getCalls(): Call[] {
        return this.calls;
    }
    async invoke(operation: string, payload: InvokePayload, options: Options): Promise<any> {
        this.calls.push({operation, payload, options});
        return {};
    }
}
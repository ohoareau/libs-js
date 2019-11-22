import {
    InvokableBackendConfig,
    TypeConfig,
} from "./types";

interface InvokableBackendInterface {
}

interface InvokableBackendInterfaceConstructor {
    new(config: InvokableBackendConfig, typeConfig: TypeConfig): InvokableBackendInterface;
}

declare const InvokableBackendInterface: InvokableBackendInterfaceConstructor;

export default InvokableBackendInterface;
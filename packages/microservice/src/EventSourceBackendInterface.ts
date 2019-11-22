import {
    EventListeners,
    EventSourceBackendConfig, Options,
    TypeConfig,
} from "./types";

interface EventSourceBackendInterface {
    process(event: any, context: any, listeners: EventListeners, options: Options): Promise<any>;
}

interface EventSourceBackendInterfaceConstructor {
    new(config: EventSourceBackendConfig, typeConfig: TypeConfig): EventSourceBackendInterface;
}

declare const EventSourceBackendInterface: EventSourceBackendInterfaceConstructor;

export default EventSourceBackendInterface;
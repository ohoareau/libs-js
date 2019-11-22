import {EventListeners, Options, Service, TypeConfig} from "../types";

export default (_, typeConfig: TypeConfig) => {
    return async (event: any, context: any) => (<Service>typeConfig.service).processEventFromEventSource(
        event, context, <EventListeners>typeConfig.eventListeners || {}, <Options>{}
    );
}
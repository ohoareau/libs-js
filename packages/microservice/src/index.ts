import {
    Service,
    Config,
    HandlerList,
    DeclarativeTypesList,
    TypeConfig,
    Microservice,
    DeclarativeTypeConfig,
    Context,
    InvokableOperations,
    InvokableList,
    InvokableOperation,
    InvokableBackendConfig,
    EventSourceBackendConfig,
    EventListener, EventList, EventListeners, EventListenerConfig,
} from './types';
import {registerTypeHandlers} from "./handler";
import BackendInterface from "./BackendInterface";
import InvokableBackendInterface from "./InvokableBackendInterface";
import EventSourceBackendInterface from "./InvokableBackendInterface";

const plugins: {
    backends: { [key: string]: BackendInterface },
    invokableBackends: { [key: string]: InvokableBackendInterface },
    eventSourceBackends: { [key: string]: EventSourceBackendInterface },
} = {
    backends: {},
    invokableBackends: {},
    eventSourceBackends: {},
};

export const buildTypeService = (config: TypeConfig): Service => {
    const backendRaw = config.backend;
    const eventSourceBackendRaw = config.eventSourceBackend;
    let backend: {type: string, config: {[key: string]: any}};
    let eventSourceBackend: {type: string, config: EventSourceBackendConfig};
    if ('string' === typeof backendRaw) {
        backend = {type: backendRaw, config: {}};
    } else {
        backend = {...backendRaw};
    }
    if (!eventSourceBackendRaw || 'string' === typeof eventSourceBackendRaw) {
        eventSourceBackend = {type: eventSourceBackendRaw || 'none', config: <EventSourceBackendConfig>{}};
    } else {
        eventSourceBackend = {...<any>eventSourceBackendRaw};
    }
    if (!plugins.backends[backend.type]) {
        throw new Error(`Unknown backend type '${backend.type}'`);
    }
    if ('none' !== eventSourceBackend.type && !plugins.eventSourceBackends[eventSourceBackend.type]) {
        throw new Error(`Unknown event source backend type '${eventSourceBackend.type}'`);
    }
    return new Service(
        config,
        new (<any>plugins.backends[backend.type])(backend.config, config),
        config.invokableOperations,
        'none' !== eventSourceBackend.type ? new (<any>plugins.eventSourceBackends[eventSourceBackend.type])(eventSourceBackend.config, config) : undefined
    );
};

export const isMigrationRequired = (context: Context, typeConfig: TypeConfig): boolean => {
    return false !== typeConfig.migration;
};

export const loadMigrationType = (context: Context, typeConfig: TypeConfig): void => {
    if (!typeConfig.types) {
        typeConfig.types = {};
    }
    typeConfig.migration = ('string' === typeof typeConfig.migration) ? typeConfig.migration : `${context.root}/migrations/${typeConfig.type}`;
    typeConfig.types.migration = {
        backend: typeConfig.backend,
        migration: false,
    };
};

export const hasInvokables = (context: Context, typeConfig: TypeConfig): boolean => {
    return !!typeConfig.invokables && ('object' === typeof typeConfig.invokables) && (0 < Object.keys(typeConfig.invokables).length);
};

export const buildInvokableOperation = (name: string, config: InvokableBackendConfig, typeConfig: TypeConfig): InvokableOperation => {
    return new (<any>plugins.invokableBackends[config.type])(config, typeConfig);
};

export const loadInvokables = (context: Context, config: TypeConfig): void => {
    config.invokableOperations = Object.keys(<InvokableList>config.invokables).reduce((acc, name) => {
        acc[name] = buildInvokableOperation(name, (<InvokableList>config.invokables)[name], config);
        return acc;
    }, <InvokableOperations>{})
};

export const hasEventTypes = (context: Context, typeConfig: TypeConfig): boolean => {
    return !!typeConfig.events && ('object' === typeof typeConfig.events) && (0 < Object.keys(typeConfig.events).length);
};

export const buildEventListener = (name: string, config: EventListenerConfig, typeConfig: TypeConfig): EventListener => {
    if ('function' === typeof config) {
        config = {callback: config};
    }
    return config.callback;
};

export const loadEventTypes = (context: Context, config: TypeConfig): void => {
    config.eventListeners = Object.keys(<EventList>config.events).reduce((acc, name) => {
        acc[name] = buildEventListener(name, (<EventList>config.events)[name], config);
        return acc;
    }, <EventListeners>{})
};

export const buildTypeConfig = (context: Context, typeName: string, typeConfig: DeclarativeTypeConfig, parentConfig?: TypeConfig): TypeConfig => {
    const config = <TypeConfig>{...typeConfig, type: typeName, parentType: parentConfig};
    isMigrationRequired(context, config) && loadMigrationType(context, config);
    hasInvokables(context, config) && loadInvokables(context, config);
    hasEventTypes(context, config) && loadEventTypes(context, config);
    return config;
};

export const registerTypesHandlers = (context: Context, handlers: HandlerList, types: DeclarativeTypesList, parentConfig?: TypeConfig): HandlerList =>
    Object.keys(types).reduce((handlers: HandlerList, typeName: string) => {
        const config = buildTypeConfig(context, typeName, types[typeName], parentConfig);
        return registerTypeHandlers(context, handlers, {...config, service: buildTypeService({...config, parentType: parentConfig})}, registerTypesHandlers, parentConfig);
    }, handlers)
;

export default (config: Config): Microservice => (<Microservice>{
    handlers: registerTypesHandlers({root: config.root}, <HandlerList>{}, config.types),
    config: <TypeConfig><any>config,
});

export const registerBackendType = (type: string, backendClass: any): void => {
    plugins.backends[type] = backendClass;
};

export const registerInvokableBackendType = (type: string, backendClass: any): void => {
    plugins.invokableBackends[type] = backendClass;
};

export const registerEventSourceBackendType = (type: string, backendClass: any): void => {
    plugins.eventSourceBackends[type] = backendClass;
};

export const getBackendTypeNames = (): string[] => {
    return Object.keys(plugins.backends);
};

export const getInvokableBackendTypeNames = (): string[] => {
    return Object.keys(plugins.invokableBackends);
};

export const getEventSourceBackendTypeNames = (): string[] => {
    return Object.keys(plugins.eventSourceBackends);
};

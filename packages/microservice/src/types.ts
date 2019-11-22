import BackendInterface from "./BackendInterface";
import EventSourceBackendInterface from "./EventSourceBackendInterface";

export type Context = {
    root: string,
}

export type Microservice = {
    handlers: HandlerList,
    config: TypeConfig,
}

export type BackendConfig = {
    [key: string]: any,
}

export type InvokableBackendConfig = {
    type: string,
    [key: string]: any,
}

export type EventSourceBackendConfig = {
    type: string,
    [key: string]: any,
}

export type InvokePayload = {
    [key: string]: any,
}

export type EventListeners = {
    [key: string]: EventListener,
}

export type EventListener = (event: any, extra: {[key:string]: any}) => Promise<any>

export type EventList = {
    [key: string]: EventListenerConfig,
}

export type EventListenerConfig = EventListener | {
    callback: EventListener,
}

export type InvokableOperations = {
    [key: string]: InvokableOperation,
}

export interface InvokableOperation {
    invoke(payload: InvokePayload, options: Options): Promise<any>;
}

export class Service {
    private readonly config: TypeConfig;
    private readonly backend: BackendInterface;
    private readonly eventSourceBackend: EventSourceBackendInterface|undefined;
    private readonly invokableOperations: {[key: string]: any};
    constructor(
        config: TypeConfig,
        backend: BackendInterface,
        invokableOperations: InvokableOperations = {},
        eventSourceBackend: EventSourceBackendInterface|undefined
        ) {
        this.config = config;
        this.backend = backend;
        this.invokableOperations = invokableOperations;
        this.eventSourceBackend = eventSourceBackend;
    }
    getType(): string {
        return this.config.type;
    }
    async get(id: string, fields: Fields = [], options: Options = {}) {
        return this.backend.get({id, fields, options});
    }
    async find(criteria: Criteria = {}, fields: Fields = [], limit: Limit = undefined, offset: Offset = undefined, sort: Sort = undefined, options: Options = {}) {
        return this.backend.find({criteria, fields, limit, offset, sort, options});
    }
    async create(data: Data = {}, options: Options = {}) {
        return this.backend.create({data, options});
    }
    async update(id: string, data: Data = {}, options: Options = {}) {
        return this.backend.update({id, data, options});
    }
    async delete(id: string, options: Options = {}) {
        return this.backend.delete({id, options});
    }
    async invoke(operation: string, payload: InvokePayload, options: Options) {
        if (!this.invokableOperations[operation]) {
            throw new Error(`Unknown invokable operation '${operation}'`);
        }
        return this.invokableOperations[operation].invoke(payload, {...options, operation});
    }
    async processEventFromEventSource(event: any, context: any, listeners: EventListeners, options: Options): Promise<any> {
        if (!this.eventSourceBackend) {
            return;
        }
        return this.eventSourceBackend.process(event, context, listeners, options);
    }
}

export type GetQuery = {
    [key: string]: any,
}

export type FindQuery = {
    [key: string]: any,
};

export type DeleteQuery = {
    [key: string]: any,
};

export type UpdateQuery = {
    [key: string]: any,
};

export type CreateQuery = {
    [key: string]: any,
};

export type DeleteResponse = {
    [key: string]: any,
};

export type UpdateResponse = {
    [key: string]: any,
};

export type Document = {
    [key: string]: any,
}

export type DocumentPage = {
    items: Document[],
}

export type Criteria = {
    [key: string]: any,
}

export type Fields = string[];

export type Limit = number|null|undefined;
export type Offset = any;

export type Sort = {[key: string]: string}|null|undefined;

export type Options = {[key: string]: any}|null|undefined;

export type Data = {[key: string]: any};

export type Handler = (event: any, context: any) => Promise<any>|any;

export type HandlerList = {
    [key: string]: Handler,
}

export type InvokableList = {
    [key: string]: InvokableBackendConfig,
}

export type TypeConfig = DeclarativeTypeConfig & {
    type: string,
    backend: string|{type: string, config: BackendConfig},
    eventSourceBackend: string|{type: string, config: EventSourceBackendConfig}|undefined,
    parentType?: TypeConfig,
    types?: DeclarativeTypesList,
    service?: Service,
    migration?: boolean|string,
    invokables?: InvokableList,
    invokableOperations?: InvokableOperations,
    events?: EventList,
    eventListeners?: EventListeners,
}

export type DeclarativeTypeConfig = {
}

export type DeclarativeTypesList = {
    [key: string]: DeclarativeTypeConfig,
}

export type Config = {
    root: string,
    types: DeclarativeTypesList,
}

export type DeclarativeHandlerConfig = {
    pattern: string,
}

export type HandlerConfig = DeclarativeHandlerConfig & {
    name: string,
}

export type HandlerMap = {
    [key: string]: {pattern: string},
}

export type TypeVariableList = {
    type: string,
    types: string,
    Type: string,
    Types: string,
    fullType: string,
    fullTypes: string,
    FullType: string,
    FullTypes: string,
    ParentFullTypes: string|undefined,
}

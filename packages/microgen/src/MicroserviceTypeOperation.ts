import Handler from './Handler';
import MicroserviceType from './MicroserviceType';

export type MicroserviceTypeOperationConfig = {
    microserviceType: MicroserviceType,
    name: string,
    type: string|undefined,
    middlewares: string[],
    backend: string,
    vars: {[key: string]: any},
    hooks: {[key: string]: any[]},
};

export default class MicroserviceTypeOperation {
    public readonly name: string;
    public readonly handler: Handler;
    public readonly microserviceType: MicroserviceType;
    constructor(microserviceType, {name, type = undefined, middlewares = [], backend, vars = {}, hooks = {}}: MicroserviceTypeOperationConfig) {
        this.microserviceType = microserviceType;
        this.name = name;
        this.handler = new Handler({name: `${microserviceType.name}_${this.name}`, type: 'service', middlewares, directory: 'handlers', params: {
            on: this.name,
            m: microserviceType.name,
            b: backend,
        }, vars: {
            ...vars,
            service: `crud/${microserviceType.name}`,
            method: type || name,
            paramsKey: true,
            configureService: false,
        }});
        const model = microserviceType.model;
        const registerReferenceEventListener = (v, operation, listener) =>
            microserviceType.microservice.package.registerEventListener(`${(<any>v).reference.replace(/\./g, '_')}_${operation}`, listener)
        ;
        switch (name) {
            case 'create':
                this.hasHooks('validate', name, microserviceType) && microserviceType.registerHook(name, 'validate', {type: 'validate', config: {}});
                this.hasHooks('transform', name, microserviceType) && microserviceType.registerHook(name, 'transform', {type: 'transform', config: {}});
                this.hasHooks('populate', name, microserviceType) && microserviceType.registerHook(name, 'populate', {type: 'populate', config: {}});
                this.hasHooks('prepare', name, microserviceType) && microserviceType.registerHook(name, 'prepare', {type: 'prepare', config: {}});
                this.hasHooks('after', name, microserviceType) && microserviceType.registerHook(name, 'after', {type: 'after', config: {}});
                break;
            case 'update':
                this.hasHooks('validate', name, microserviceType) && microserviceType.registerHook(name, 'validate', {type: 'validate', config: {required: false}});
                this.hasHooks('transform', name, microserviceType) && microserviceType.registerHook(name, 'transform', {type: 'transform', config: {}});
                this.hasHooks('populate', name, microserviceType) && microserviceType.registerHook(name, 'populate', {type: 'populate', config: {prefix: 'update'}});
                this.hasHooks('prepare', name, microserviceType) && microserviceType.registerHook(name, 'prepare', {type: 'prepare', config: {}});
                this.hasHooks('after', name, microserviceType) && microserviceType.registerHook(name, 'after', {type: 'after', config: {}});
                Object.entries(model.referenceFields || {}).forEach(([k, v]: [string, any]) =>
                    registerReferenceEventListener(v, 'update', {
                        type: 'operation',
                        config: {
                            operation: `${microserviceType.name}_update`,
                            params: {
                                id: {[k]: `{{data.${v.idField}}}`},
                                input: {[k]: `{{data.${v.idField}}}`},
                                contextData: '{{data}}',
                            },
                        },
                    })
                );
                break;
            case 'delete':
                Object.entries(model.referenceFields || {}).forEach(([k, v]: [string, any]) =>
                    registerReferenceEventListener(v, 'delete', {
                        type: 'operation',
                        config: {
                            operation: `${microserviceType.name}_delete`,
                            params: {
                                id: {[k]: `{{data.${v.idField}}}`},
                                contextData: '{{data}}',
                            },
                        },
                    })
                );
                break;
            default:
                break;
        }
        Object.entries(hooks).forEach(([k, v]) => {
            v.forEach(h => microserviceType.registerHook(this.name, k, h));
        });
    }
    hasHooks(type: string, operation: string, microserviceType: MicroserviceType): boolean {
        switch (type) {
            case 'validate':
                return !!Object.keys(microserviceType.model.fields).length;
            case 'transform':
                return !!Object.keys(microserviceType.model.transformers).length;
            case 'populate':
                switch (operation) {
                    case 'create':
                        return !!Object.keys(microserviceType.model.values).length || !!Object.keys(microserviceType.model.defaultValues).length;
                    case 'update':
                        return !!Object.keys(microserviceType.model.updateValues).length || !!Object.keys(microserviceType.model.updateDefaultValues).length;
                    default:
                        return false;
                }
            case 'prepare':
                return !!Object.keys(microserviceType.model.volatileFields).length;
            case 'after':
                return !!Object.keys(microserviceType.model.volatileFields).length;
            default:
                return false;
        }
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return this.handler.generate(vars);
    }
}
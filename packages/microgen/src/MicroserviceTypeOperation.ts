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
                model.hooks.validate_create && microserviceType.registerHook(name, 'validate', {type: 'validate', config: {}});
                model.hooks.transform_create && microserviceType.registerHook(name, 'transform', {type: 'transform', config: {}});
                model.hooks.populate_create && microserviceType.registerHook(name, 'populate', {type: 'populate', config: {}});
                model.hooks.prepare_create && microserviceType.registerHook(name, 'prepare', {type: 'prepare', config: {}});
                model.hooks.after_create && microserviceType.registerHook(name, 'after', {type: 'after', config: {}});
                break;
            case 'update':
                model.hooks.validate_update && microserviceType.registerHook(name, 'validate', {type: 'validate', config: {required: false}});
                model.hooks.transform_update && microserviceType.registerHook(name, 'transform', {type: 'transform', config: {}});
                model.hooks.populate_update && microserviceType.registerHook(name, 'populate', {type: 'populate', config: {prefix: 'update'}});
                model.hooks.prepare_update && microserviceType.registerHook(name, 'prepare', {type: 'prepare', config: {}});
                model.hooks.after_update && microserviceType.registerHook(name, 'after', {type: 'after', config: {}});
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
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        return this.handler.generate(vars);
    }
}
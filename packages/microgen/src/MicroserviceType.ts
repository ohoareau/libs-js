import Service from './Service';
import Handler from './Handler';
import SchemaParser from './SchemaParser';
import Microservice from './Microservice';
import stringifyObject from 'stringify-object';
import MicroserviceTypeOperation, {MicroserviceTypeOperationConfig} from './MicroserviceTypeOperation';

export type MicroserviceTypeConfig = {
    microservice: Microservice,
    name: string,
    schema: any,
    handlers?: any,
    operations?: {[key: string]: MicroserviceTypeOperationConfig},
    middlewares?: string[],
    backends?: string[] | {type: string, name: string}[],
};

export default class MicroserviceType {
    public readonly name: string;
    public readonly operations: {[key: string]: MicroserviceTypeOperation} = {};
    public readonly model: any;
    public readonly hooks: {[key: string]: any[]} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly service: Service;
    public readonly backends: {[key: string]: any};
    public readonly defaultBackendName: string;
    public readonly microservice: Microservice;
    constructor(microservice: Microservice, {name, schema = {}, operations = {}, middlewares = [], backends = [], handlers = {}}: MicroserviceTypeConfig) {
        this.microservice = microservice;
        this.name = `${microservice.name}_${name}`;
        this.model = {name: this.name, ...(new SchemaParser().parse(schema))};
        this.backends = (<any>backends).reduce((acc, b) => {
            if ('string' === typeof b) b = {type: 'backend', name: b};
            return Object.assign(acc, {[b.name]: b});
        }, {'@caller': {type: 'service', name: '@caller'}});
        const defaultBackendName: any = [...backends].shift();
        this.defaultBackendName = !defaultBackendName ? undefined : (('string' == typeof defaultBackendName) ? defaultBackendName : defaultBackendName.name);
        this.defaultBackendName && ('@' === this.defaultBackendName.substr(0, 1)) && (this.defaultBackendName = this.defaultBackendName.substr(1));
        Object.entries(operations).forEach(
            ([name, c]: [string, any]) =>
                this.operations[name] = new MicroserviceTypeOperation(
                    this,
                    {
                        name,
                        ...c,
                        middlewares: [...middlewares, ...(c.middlewares || [])],
                        backend: c.backend || this.defaultBackendName,
                    }
                )
        );
        this.service = new Service({name: `crud/${microservice.name}_${name}`, ...this.buildServiceConfig({schema, operations})});
        const opNames = Object.keys(this.operations);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name: `${this.name}${'handler' === name ? '' : `_${name}`}`, ...c, directory: 'handlers', vars: {...(c.vars || {}), operations: opNames, prefix: this.name}})
        );
    }
    registerHook(operation, type, hook) {
        this.hooks[operation] = this.hooks[operation] || {};
        this.hooks[operation][type] = this.hooks[operation][type] || [];
        this.hooks[operation][type].push(hook);
        return this;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        vars = {...vars, model: this.model};
        return (await Promise.all(Object.values(this.operations).map(
            async o => o.generate(vars)))).reduce((acc, r) =>
            Object.assign(acc, r),
            {
                ...(await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, ff) => Object.assign(acc, ff), {}),
                ...(await this.service.generate({
                    ...vars,
                    params: {m: this.name},
                    initializations: [
                        `const model = require('../../models/${this.name}');`,
                    ],
                })),
                [`models/${this.name}.js`]: ({jsStringify}) => `module.exports = ${jsStringify(this.model, 70)};`,
            }
        );
    }
    buildBackendsVariables() {
        const backends = Object.entries(this.backends);
        backends.sort((a, b) => a[0] < b[0] ? -1 : (a[0] === b[0] ? 0 : -1));
        return backends.reduce((acc, [n, {type, name, ...c}]) => {
            if ('backend' === type) {
                if ('@' === n.substr(0, 1)) {
                    const nn = n.substr(1);
                    acc[nn] = {code: `require('@ohoareau/microlib/lib/backends/${nn}').default(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                } else {
                    acc[n] = {code: `require('../../backends/${n}')(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                }
            } else {
                if ('@' === n.substr(0, 1)) {
                    const nn = n.substr(1);
                    acc[nn] = {code: `require('@ohoareau/microlib/lib/${type}s/${nn}').default`};
                } else {
                    acc[n] = {code: `require('../../${type}s/${n}')`};
                }
            }
            return acc;
        }, {});
    }
    buildServiceConfig({schema, operations}) {
        const methods = Object.entries(operations).reduce((acc, [k, v]) => {
            acc[k] = this.buildServiceMethodConfig({schema, name: k, ...<any>v});
            return acc;
        }, {});
        return {
            variables: {
                model: {code: undefined},
                ...(!!Object.values(methods).find(m => !!(<any>m)['needHook']) ? {buildHookFor: {code: `require('@ohoareau/microlib/lib/utils').initHook`}} : {}),
                ...this.buildBackendsVariables(),
            },
            methods,
            test: {
                mocks: Object.entries(this.backends).map(([n, {type}]) => {
                    if ('@' === n.substr(0, 1)) {
                        return `@ohoareau/microlib/lib/${type}s/${n.substr(1)}`;
                    } else {
                        return `../../${type}s/${n}`;
                    }
                }),
                groups: {
                    [this.name]: {
                        name: this.name,
                        tests: [],
                    }
                }
            }
        };
    }
    buildServiceMethodConfig({backend, name}) {
        const backendName = backend || this.defaultBackendName;
        const befores = ['validate', 'populate', 'transform', 'before', 'prepare'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(h, {position: 'before'})));
        }, []);
        const afters = ['after', 'notify', 'clean'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(h, {position: 'after'})));
        }, []);
        const needHook = befores.reduce((acc, b) => acc || / hook\(/.test(b), false)
            || afters.reduce((acc, b) => acc || / hook\(/.test(b), <boolean>false)
        ;
        const batchMode = /^batch/.test(name);
        let nonBatchName = name.replace(/^batch/, '');
        nonBatchName = `${nonBatchName.substr(0, 1).toLowerCase()}${nonBatchName.substr(1)}`;
        const lines = [
            needHook && `    const hook = service.buildHookFor('${this.name}_${name}', model, __dirname);`,
            ...befores,
            (!batchMode && !afters.length) && `    return service.${backendName}.${name}(query);`,
            (!batchMode && !!afters.length) && `    let result = await service.${backendName}.${name}(query);`,
            (batchMode && !afters.length) && `    return Promise.all(data.map(d => service.${nonBatchName}({data: d, ...query})));`,
            (batchMode && !!afters.length) && `    let result = Promise.all(data.map(d => service.${nonBatchName}({data: d, ...query})));`,
            ...afters,
            (!!afters.length) && '    return result;',
        ].filter(x => !!x);
        return {
            needHook,
            async: true,
            args: batchMode ? ['{data = [], ...query}'] : ['query'],
            code: lines.join("\n"),
        };
    }
    buildHookCode({type, iteratorKey = undefined, ensureKeys = [], trackData = [], config = {}}, options = {}) {
        const opts = {};
        if (iteratorKey) opts['loop'] = iteratorKey;
        if (ensureKeys && !!ensureKeys.length) opts['ensureKeys'] = ensureKeys;
        if (trackData && !!trackData.length) opts['trackData'] = trackData;
        let call: string|undefined = undefined;
        switch (type) {
            case '@get':
                return `    Object.assign(query, await service.get(query.id, ${this.stringifyForHook(config['fields'] || [], options)}));`;
            default:
                break;
        }
        const rawOpts = !!Object.keys(opts).length ? `, ${this.stringifyForHook(opts, options)}` : '';
        if (!rawOpts && '@operation' === type) {
            return `    await service.caller.execute('${config['operation']}', ${this.stringifyForHook(config['params'], options)});`;
        }
        const cfg = (!!Object.keys(config).length || !!rawOpts) ? `, ${this.stringifyForHook(config, options)}` : '';
        switch (options['position']) {
            case 'before':
                call = `await hook('${type}', query${cfg}${rawOpts})`;
                break;
            case 'after':
                call = `await hook('${type}', [result, query]${cfg}${rawOpts})`;
                break;
            default:
                break;
        }
        switch (options['position']) {
            case 'before': return `    query = ${call};`;
            case 'after':  return `    result = ${call};`;
            default: return undefined;
        }
    }
    stringifyForHook(o, {position = undefined}) {
        return stringifyObject(o, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true, transform: (obj, prop, originalResult) => {
            let x = originalResult;
            if (/'\{\{[^{}]+}}'/.test(x)) {
                let a;
                const r = /'\{\{([^{}]+)}}'/;
                let prefix = '';
                switch (<any>position) {
                    case 'before': prefix = 'query.'; break;
                    case 'after': prefix = 'result.'; break;
                    default: break;
                }
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `${prefix}${a[1]}`);
                }
            }
            if (/'\[\[process.env.[^{}]+]]'/.test(x)) {
                let a;
                const r = /'\[\[(process.env.[^{}]+)]]'/;
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], a[1]);
                }
            }
            return x;
        }});
    }
}
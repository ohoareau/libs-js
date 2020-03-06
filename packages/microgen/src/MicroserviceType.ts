import Service from './Service';
import Handler from './Handler';
import SchemaParser from './SchemaParser';
import Microservice from './Microservice';
import stringifyObject from 'stringify-object';
import MicroserviceTypeOperation, {MicroserviceTypeOperationConfig} from './MicroserviceTypeOperation';

export type MicroserviceTypeConfig = {
    microservice: Microservice,
    name: string,
    attributes: {[key: string]: any},
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
    constructor(microservice: Microservice, {name, attributes = {}, operations = {}, middlewares = [], backends = [], handlers = {}}: MicroserviceTypeConfig) {
        this.microservice = microservice;
        this.name = `${microservice.name}_${name}`;
        this.model = new SchemaParser().parse({name: this.name, attributes, operations});
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
        this.service = new Service({name: `crud/${microservice.name}_${name}`, ...this.buildServiceConfig({attributes, operations}, {})});
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
        return backends.reduce((acc, [n, {type, name, realName, ...c}]) => {
            realName = realName || n;
            n = '@' === n.substr(0, 1) ? n.substr(1) : n;
            if ('backend' === type) {
                if ('@' === realName.substr(0, 1)) {
                    const nn = realName.substr(1);
                    acc[n] = {code: `require('@ohoareau/microlib/lib/backends/${nn}').default(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                } else {
                    acc[n] = {code: `require('../../backends/${realName}')(model${(c && !!Object.keys(c).length) ? `, ${stringifyObject(c, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})}` : ''})`};
                }
            } else {
                if ('@' === realName.substr(0, 1)) {
                    const nn = realName.substr(1);
                    acc[n] = {code: `require('@ohoareau/microlib/lib/${type}s/${nn}').default`};
                } else {
                    acc[n] = {code: `require('../../${type}s/${realName}')`};
                }
            }
            return acc;
        }, {});
    }
    buildServiceConfig({attributes, operations}, requirements) {
        const methods = Object.entries(operations).reduce((acc, [k, v]) => {
            acc[k] = this.buildServiceMethodConfig({attributes, name: k, ...<any>v}, requirements);
            return acc;
        }, {});
        return {
            variables: {
                model: {code: undefined},
                ...(!!Object.values(methods).find(m => !!(<any>m)['needHook']) ? {helpers: {code: `require('@ohoareau/microlib/lib/utils').createOperationHelpers`}} : {}),
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
    buildServiceMethodConfig({backend, name}, requirements) {
        let backendDef = backend || this.defaultBackendName;
        if (backendDef) {
            if ('string' === typeof backendDef) {
                backendDef = {name: backendDef};
            }
            backendDef = {method: name, args: ['query'], ...backendDef};
            (backendDef.name && ('@' === backendDef.name.substr(0, 1)) && (backendDef.name = backendDef.name.substr(1)));
        }
        const localRequirements = {};
        const befores = ['init', 'validate', 'populate', 'transform', 'authorize', 'before', 'prepare'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(localRequirements, h, {position: 'before'})));
        }, []);
        const afters = ['after', 'notify', 'clean', 'end'].reduce((acc, n) => {
            if (!this.hooks[name]) return acc;
            if (!this.hooks[name][n]) return acc;
            return acc.concat(this.hooks[name][n].map(h => this.buildHookCode(localRequirements, h, {position: 'after'})));
        }, []);
        const needHook = befores.reduce((acc, b) => acc || / hook\(/.test(b), false)
            || afters.reduce((acc, b) => acc || / hook\(/.test(b), <boolean>false)
        ;
        const batchMode = /^batch/.test(name);
        let nonBatchName = name.replace(/^batch/, '');
        nonBatchName = `${nonBatchName.substr(0, 1).toLowerCase()}${nonBatchName.substr(1)}`;
        const neededUtils = ['hook', ...Object.keys(localRequirements)];
        neededUtils.sort();
        const lines = [
            needHook && `    const {${neededUtils.join(', ')}} = service.helpers('${this.name}_${name}', model, __dirname);`,
            ...befores,
            (!backendDef && !batchMode && !afters.length) && `    return undefined;`,
            (!!backendDef && !batchMode && !afters.length) && `    return ${this.buildBackendCall({prefix: 'service.', ...backendDef})};`,
            (!backendDef && !batchMode && !!afters.length) && `    let result = undefined;`,
            (!!backendDef && !batchMode && !!afters.length) && `    let result = await ${this.buildBackendCall({prefix: 'service.', ...backendDef})};`,
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
    buildBackendCall({prefix, name, method, args}) {
        return `${prefix}${'this' === name ? '' : `${name}.`}${method}(${args.join(', ')})`;
    }
    buildConditionPartCode(condition, requirements) {
        if ('string' === typeof condition) {
            let matches = condition.match(/^\s*@([a-z0-9_]+)\s*\[\s*([a-z0-9_]+|\*)\s*=>\s*([a-z0-9_]+|\*)\s*\]\s*$/i);
            if (!matches) {
                matches = condition.match(/^\s*@([a-z0-9_]+)\s*=(.*)$/i);
                if (!matches) {
                    throw new Error(`Unsupported condition definition: ${condition}`);
                } else {
                    condition = {
                        type: 'value',
                        attribute: matches[1],
                        value: matches[2],
                    };
                }
            } else {
                condition = {
                    type: 'transition',
                    attribute: matches[1],
                    from: matches[2],
                    to: matches[3],
                };
            }
        } else if ('object' === typeof condition) {
            condition = {type: 'unknown', ...condition};
        } else {
            throw new Error(`Unsupported condition definition format: ${JSON.stringify(condition)}`);
        }
        switch (condition.type) {
            case 'transition':
                requirements['isTransition'] = true;
                return `isTransition('${condition.attribute}', '${condition.from}', '${condition.to}', query)`;
            case 'value':
                requirements['isValue'] = true;
                return `isValue('${condition.attribute}', '${condition.value}', query)`;
            default:
                throw new Error(`Unknown condition type '${condition.type}'`);
        }
    }
    buildConditionCode(ifTrue, ifFalse, requirements) {
        const conditions = <{isTrue: boolean, condition: any}[]>[];
        !!ifTrue && conditions.push({isTrue: true, condition: ifTrue});
        !!ifFalse && conditions.push({isTrue: false, condition: ifFalse});
        return conditions.reduce((acc, {isTrue, condition}) => {
            const r = this.buildConditionPartCode(condition, requirements);
            acc = `${acc ? acc : ''}${isTrue ? '' : '!'}${r} && `;
            return acc;
        }, <any>undefined);
    }
    buildHookCode(requirements, {if: condition, ifNot: conditionNot, type, iteratorKey = undefined, ensureKeys = [], trackData = [], config = {}}, options = {}) {
        const opts = {};
        if (iteratorKey) opts['loop'] = iteratorKey;
        if (ensureKeys && !!ensureKeys.length) opts['ensureKeys'] = ensureKeys;
        if (trackData && !!trackData.length) opts['trackData'] = trackData;
        const conditionCode = this.buildConditionCode(condition, conditionNot, requirements);
        let call: string|undefined = undefined;
        switch (type) {
            case '@get':
                return `    ${conditionCode || ''}Object.assign(query, await service.get(query.id, ${this.stringifyForHook(config['fields'] || [], options)}));`;
            default:
                break;
        }
        const rawOpts = !!Object.keys(opts).length ? `, ${this.stringifyForHook(opts, options)}` : '';
        if (!rawOpts && '@operation' === type) {
            return `    ${conditionCode || ''}await service.caller.execute('${config['operation']}', ${this.stringifyForHook(config['params'], options)}, __dirname);`;
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
            case 'before': return `    ${conditionCode ? `${conditionCode || ''}(query = ${call});` : `query = ${call};`}`;
            case 'after':  return `    ${conditionCode ? `${conditionCode || ''}(result = ${call});` : `result = ${call};`}`;
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
            if (/'\{q\{[^{}]+}}'/.test(x)) {
                let a;
                const r = /'\{q\{([^{}]+)}}'/;
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `query.${a[1]}`);
                }
            }
            if (/'\{r\{[^{}]+}}'/.test(x)) {
                let a;
                const r = /'\{r\{([^{}]+)}}'/;
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `result.${a[1]}`);
                }
            }
            if (/\{\{[^{}]+}}/.test(x)) {
                let a;
                const r = /\{\{([^{}]+)}}/g;
                let prefix = '';
                switch (<any>position) {
                    case 'before': prefix = 'query.'; break;
                    case 'after': prefix = 'result.'; break;
                    default: break;
                }
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `\${${prefix}${a[1]}}`);
                }
                x = `\`${x.substr(1, x.length - 2)}\``;
            }
            if (/'%[a-z0-9_]+'/i.test(x)) {
                let a;
                const r = /'%([a-z0-9]+)'/i;
                let prefix = 'query.oldData.';
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `${prefix}${a[1]}`);
                }
            }
            if (/'#[a-z0-9_]+'/i.test(x)) {
                let a;
                const r = /'#([a-z0-9]+)'/i;
                let prefix = 'query.user.';
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], `${prefix}${a[1]}`);
                }
            }
            if (/'\$[a-z0-9_]+'/i.test(x)) {
                let a;
                const r = /'\$([a-z0-9]+)'/i;
                let prefix = '';
                switch (<any>position) {
                    case 'before': prefix = 'query.data.'; break;
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
            if (/'\[\[now]]'/.test(x)) {
                let a;
                const r = /'\[\[now]]'/;
                while ((a = r.exec(x)) !== null) {
                    x = x.replace(a[0], 'new Date().valueOf()');
                }
            }
            return x;
        }});
    }
}
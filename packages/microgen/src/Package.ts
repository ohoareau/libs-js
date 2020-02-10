import Handler, {HandlerConfig} from './Handler';
import Microservice, {MicroserviceConfig} from './Microservice';

const fs = require('fs');

export type PackageConfig = {
    name: string,
    files?: {[key: string]: any},
    events?: {[key: string]: any[]},
    handlers?: {[key: string]: HandlerConfig},
    microservices?: {[key: string]: MicroserviceConfig},
    sources?: string[],
    vars?: {[key: string]: any},
};

export default class Package {
    public readonly name: string;
    public readonly microservices: {[key: string]: Microservice} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly events: {[key: string]: any[]} = {};
    public readonly sources: string[] = [];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    constructor({name, files = {}, events = {}, handlers = {}, microservices = {}, sources = [], vars = {}}: PackageConfig) {
        this.name = name;
        this.events = events || {};
        this.sources = sources;
        this.vars = vars;
        this.files = files;
        Object.entries(microservices).forEach(
            ([name, c]: [string, any]) => {
                this.microservices[name] = new Microservice(this, {name, ...c});
            }
        );
        const opNames = Object.entries(this.microservices).reduce((acc, [n, m]) =>
            Object.entries(m.types).reduce((acc2, [n2, t]) =>
                Object.keys(t.operations).reduce((acc3, n3) => {
                    acc3.push(`${n}_${n2}_${n3}`);
                    return acc3;
                }, acc2)
            , acc)
        , <string[]>[]);
        Object.keys(handlers).reduce((acc, h) => {
            acc.push(h);
            return acc;
        }, opNames);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name, ...c, directory: name === 'handler' ? undefined : 'handlers', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : undefined}})
        );
    }
    registerEventListener(event, listener) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(listener);
        return this;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        vars = {name: this.name, ...this.vars, ...vars};
        const files = (await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, f) => ({...acc, ...f}), {
            ['package.json']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: {
                    bcryptjs: '^2.4.3',
                    dynamoose: '^1.11.1',
                    uuid: '^3.4.0',
                    ...(vars.dependencies || {}),
                },
                scripts: {
                    test: 'jest',
                    ...(vars.scripts || {}),
                },
                devDependencies: {
                    jest: '^25.1.0',
                    'aws-sdk': '^2',
                    ...(vars.devDependencies || {}),
                },
                version: vars.version || '1.0.0',
                description: vars.description || 'AWS Lambda project',
                author: vars.author ? `${vars.author.name} <${vars.author.email}>` : 'Confidential',
                private: true,
            }, null, 4),
            ['LICENSE.md']: ({renderFile}) => renderFile('LICENSE.md.ejs', vars),
            ['README.md']: ({renderFile}) => renderFile('README.md.ejs', vars),
            ['.gitignore']: ({renderFile}) => renderFile('.gitignore.ejs', vars),
            ['Makefile']: ({renderFile}) => renderFile('Makefile.ejs', vars),
            ...(Object.entries(this.files).reduce((acc, [k, v]) => {
                acc[k] = 'string' === typeof v ? (() => v) : (({renderFile}) => renderFile(v.template, v));
                return acc;
            }, {}))
        });
        const objects: any = (<any[]>[]).concat(
            Object.values(this.microservices),
            Object.values(this.handlers)
        );
        <Promise<any>>(await Promise.all(objects.map(async o => (<any>o).generate(vars)))).reduce(
            (acc, r) => Object.assign(acc, r),
            files
        );
        if (this.events && !!Object.keys(this.events).length) {
            files['models/events.js'] = ({jsStringify}) => `module.exports = ${jsStringify(this.events, 100)};`
        }
        if (vars.write) {
            if (!vars.targetDir) throw new Error('No target directory specified');
            await Promise.all(fs.readdirSync(`${__dirname}/../statics`, {}).map(async f => {
                f = `${f}`;
                if ('.' === f || '..' === f) return;
                files[f] = ({copy}) => copy(`${__dirname}/../statics/${f}`, f);
            }));
            const root = vars.configFileDir;
            await Promise.all((this.sources).map(async dir => {
                if (!fs.existsSync(`${root}/${dir}`)) return [];
                return Promise.all(fs.readdirSync(`${root}/${dir}`, {}).map(async f => {
                    f = `${f}`;
                    if ('.' === f || '..' === f) return;
                    files[f] = ({copy}) => copy(`${root}/${dir}/${f}`, f);
                }));
            }));
        }
        return files;
    }
}
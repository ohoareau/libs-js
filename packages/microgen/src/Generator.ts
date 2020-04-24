import ejs from 'ejs';
import IPackage from './IPackage';
import * as packagers from './packagers';
import stringifyObject from 'stringify-object';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

export type GeneratorConfig = {
    vars?: any,
    packages?: {[key: string]: any},
};

const jsStringify = (o, inline = false, indentSize = 4) => stringifyObject(o, {indent: ''.padEnd(indentSize), singleQuotes: true, inlineCharacterLimit: 'number' !== typeof inline ? undefined : inline});
const indent = (t, offset = 4) => (t || '').split(/\n/g).map(x => `${x ? ''.padEnd(offset) : ''}${x}`).join("\n");
const render = (string, vars = {}, options = {}) => ejs.render(string, {indent, jsStringify, ...vars}, options);
const renderFile = (path, vars = {}) => {
    const filename = `${__dirname}/../templates/${path}`;
    return render(fs.readFileSync(filename, 'utf8'), vars, {filename});
};
const copy = (source, target) => {
    fse.copySync(source, target);
    return true;
};
const writeFile = (target, content) => {
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
    return true;
};

export default class Generator {
    public readonly packagers: {[key: string]: (config: any) => IPackage} = {};
    public readonly packages: {[key: string]: any} = {};
    public readonly vars: {[key: string]: any} = {};
    public readonly defaultPackagerName: string = 'js_lambda';
    constructor({packages = {}, vars = {}}: GeneratorConfig) {
        this.vars = {
            generator: 'microgen',
            license: 'MIT',
            date: new Date().toISOString(),
            ...vars,
        };
        this.packages = packages;
        Object.entries(packagers).forEach(([n, p]) => this.registerPackager(n, p));
    }
    registerPackager(type: string, packager: (config: any) => IPackage) {
        this.packagers[type] = packager;
    }
    async prepare(): Promise<IPackage[]> {
        return Object.entries(this.packages).map(
            ([name, {type = this.defaultPackagerName, ...c}]: [string, any]) => {
                if (!this.packagers[type]) throw new Error(`Unsupported package type '${type}'`);
                return this.packagers[type]({...c, name, vars: {...this.vars, ...(c.vars || {})}});
            }
        );
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const packages = await this.prepare();
        const {write = false, targetDir} = vars;
        const result = (await Promise.all(packages.map(async p => [(<any>p).name, await p.generate(vars)])))
            .reduce(
                (acc, [p, f]) =>
                    Object.entries(f).reduce((acc2, [k, v]) => {
                        acc2[`${p}/${k}`] = [p, v];
                        return acc2;
                    }, acc)
                ,
                {}
            )
        ;
        const entries = Object.entries(result);
        entries.sort(([k1], [k2]) => k1 < k2 ? -1 : (k1 === k2 ? 0 : 1));
        entries.forEach(([k, x]) => {
            const [p, v] = <any>x;
            const filePath = `${targetDir}/${k}`;
            if (!this.vars || !this.vars.locked || !this.vars.locked[k]) {
                result[k] = (<any>v)(this.createPackageHelpers(p, vars));
                if (write && (true !== result[k])) writeFile(filePath, result[k]);
            }
        });
        return result;
    }
    createPackageHelpers(name, vars) {
        return {
            render,
            renderFile,
            jsStringify,
            copy: (source, target) => copy(source, `${vars.targetDir}/${name}/${target}`),
        };
    }
}
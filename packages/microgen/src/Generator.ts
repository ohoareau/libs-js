import ejs from 'ejs';
import Package from './Package';
import stringifyObject from 'stringify-object';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

export type GeneratorConfig = {
    vars?: any,
    packages?: any,
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
    public readonly packages: {[key: string]: Package} = {};
    public readonly vars: {[key: string]: any} = {};
    constructor({packages = {}, vars = {}}: GeneratorConfig) {
        this.vars = {
            generator: 'microgen',
            license: 'MIT',
            date: new Date().toISOString(),
            ...vars,
        };
        Object.entries(packages).forEach(
            ([name, c]: [string, any]) =>
                this.packages[name] = new Package({
                    name,
                    ...c,
                    vars: {...this.vars, ...(c.vars || {})},
                })
        );
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const {write = false, targetDir} = vars;
        const result = (await Promise.all(
            Object.values(this.packages).map(
                async p => [(<any>p).name, await p.generate(vars)]
            )
        )).reduce(
            (acc, [p, f]) =>
                Object.entries(f).reduce((acc2, [k, v]) => {
                    acc2[`${p}/${k}`] = [p, v];
                    return acc2;
                }, acc)
            ,
            {}
        );
        const entries = Object.entries(result);
        entries.sort(([k1], [k2]) => k1 < k2 ? -1 : (k1 === k2 ? 0 : 1));
        entries.forEach(([k, x]) => {
            const [p, v] = <any>x;
            const filePath = `${targetDir}/${k}`;
            result[k] = (<any>v)(this.createPackageHelpers(p, vars));
            if (write && (true !== result[k])) writeFile(filePath, result[k]);
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
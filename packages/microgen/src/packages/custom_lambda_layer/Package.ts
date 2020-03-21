const fs = require('fs');

export type PackageConfig = {
    name: string,
    sources?: string[],
    files?: {[key: string]: any},
    vars?: {[key: string]: any},
};

export default class Package {
    public readonly name: string;
    public readonly sources: string[] = [];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    constructor({name, sources = [], files = {}, vars = {}}: PackageConfig) {
        this.name = name;
        this.sources = sources;
        this.vars = vars;
        this.files = files;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        vars = {deployable: false, name: this.name, ...this.vars, ...vars};

        const files = {
            ['LICENSE']: ({renderFile}) => renderFile('common/licenses/custom.md.ejs', vars),
            ['README.md']: ({renderFile}) => renderFile('custom_lambda_layer/README.md.ejs', vars),
            ['.gitignore']: ({renderFile}) => renderFile('custom_lambda_layer/.gitignore.ejs', vars),
            ['Makefile']: ({renderFile}) => renderFile('custom_lambda_layer/Makefile.ejs', vars),
            ...(Object.entries(this.files).reduce((acc, [k, v]) => {
                acc[k] = 'string' === typeof v ? (() => v) : (({renderFile}) => renderFile(`js_lambda/${v.template}`, v));
                return acc;
            }, {}))
        };
        if (vars.write) {
            if (!vars.targetDir) throw new Error('No target directory specified');
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

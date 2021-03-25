import {spawn} from 'child_process';
import Handlebars from 'handlebars';
import {dirname, resolve} from 'path';
import {readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync} from 'fs';

Handlebars.registerHelper('slugify', s => s.replace(/[^a-z0-9_]+/g, '-'));

export const buildVarKey = k => k.toUpperCase();
export const buildVarValue = (s, d, ss) => {
    const v = (('_' === s) ? `${d}` : (ss[s] ? (ss[s][d] ? `${ss[s][d]}` : '') : '')).trim();
    return ((0 <= v.indexOf(' ')) || (0 <= v.indexOf(';'))) ? `"${v}"` : v;
}
export const parseLayerVariableDsn = d => (!/^@[^:]+:.+$/.test(d)) ? ['_', d] : d.substr(1).split(/:/).slice(0, 2);
export const flattenJsonVars = v => Object.keys(v.variables || {}).reduce((acc, k) => Object.assign(acc, {[k]: v.variables[k].value}), {});

export const buildVars = (vars, repo) => {
    const [layers, variables] = Object.keys(vars).reduce((acc, k) => {
        const [ layer, varName ] = parseLayerVariableDsn(vars[k]);
        acc[0][layer] = true;
        acc[1][k] = [layer, varName];
        return acc;
    }, [{}, {}]);
    const layerNames = Object.keys(layers);
    layerNames.sort();
    const sources = {};
    layerNames.forEach(l => {
        try {
            sources[l] = flattenJsonVars(JSON.parse(readFileSync(`${repo}/${l}.json`, 'utf8'))) || {};
        } catch (e) {
            sources[l] = {};
        }
    });
    return Object.keys(variables).reduce((acc, k) => {
        const [source, data] = variables[k];
        acc.push(`${buildVarKey(k)}=${buildVarValue(source, data, sources)}`);
        return acc;
    }, <string[]>[]).join("\n");
};

export const generateVarsFromTerraformOutputs = (configFile, repo) => {
    if (!existsSync(configFile)) return '';
    const config = JSON.parse(readFileSync(configFile, 'utf-8'));
    return buildVars(config, repo);
};

export const generateEnvLayerFromFile = async (sourceFile, targetFile, vars) => {
    const parentDir = dirname(targetFile);
    existsSync(parentDir) || mkdirSync(parentDir, {recursive: true});
    writeFileSync(targetFile, replaceVars(readFileSync(sourceFile, 'utf8'), vars));
};

export const replaceVars = (a, b) => {
    if ((Array.isArray(a))) {
        a.forEach((v, i) => {a[i] = replaceVars(v, b);});
        return a;
    }
    if ('object' === typeof a) {
        return Object.entries(a).reduce((acc, [k, v]) => {
            acc[k] = replaceVars(v, b);
            return acc;
        }, a);
    }
    return Handlebars.compile(a)(b);
};

export const generateLayerVars = (vars, layer) => replaceVars(vars, layer);

export const mergeEnvConfig = (config, name) => ({...config.common, ...config.environments[name], env: name});

export const tfgen = async (configFile, sourceDir, targetDir) => {
    const layers = readdirSync(sourceDir, {withFileTypes: true}).filter(e => !e.isDirectory() && /.tmpl.tf$/.test(e.name)).map(e => ({name: e.name.replace(/\.tmpl\.tf$/, ''), file: e.name, filePath: `${sourceDir}/${e.name}`}));
    const config = require(resolve(configFile));
    await Promise.all(Object.keys(config.environments || {}).map(async name => {
        const env = mergeEnvConfig(config, name);
        await Promise.all(layers.map(async ({name: layer, file, filePath}) => {
            const layerEnv = {...env, env: name, layer: layer};
            const layerConfig = (config && config.layers && config.layers[layer]) || {};
            if (layerConfig) {
                if (layerConfig.only_on_envs && !layerConfig.only_on_envs.includes(name)) return;
                if (layerConfig.not_on_envs && !!layerConfig.not_on_envs.includes(name)) return;
            }
            await generateEnvLayerFromFile(filePath, `${targetDir}/${name}/${file.replace(/\.tmpl\.tf$/, '')}/main.tf`, generateLayerVars(layerEnv, layerEnv));
        }));
    }));
};

export const actions = {
    init: {executeDepends: false},
    get: {executeDepends: false},
    update: {executeDepends: false},
    plan: {executeDepends: false},
    apply: {executeDepends: false},
    output: {executeDepends: false},
    sync: {executeDepends: true},
    destroy: {executeRequires: true, executeDepends: true},
};

export const rawLogger = ({group, type, data, error = false}) => {
    type === 'message' && console[error ? 'error' : 'log'](`[${group}] ${data}`);
};

export const runLayerCommand = async ({ name, path }, {logger = rawLogger, silent = false}, cmd, ...args) =>
    new Promise((resolve, reject) => {
        const p = spawn(cmd, args, {cwd: path});
        logger({group: name, type: 'starting', data: {cmd, args, path}});
        p.stdout.on('data', (data) => {
            data.toString().replace(/(\r\n|\n)$/, '').split(/\r\n/).forEach(s => {
                s.split(/\n/).forEach(ss => {
                    logger({group: name, type: 'message', data: ss});
                });
            });
        });
        p.stderr.on('data', (data) => {
            data.toString().replace(/(\r\n|\n)$/, '').split(/\r\n/).forEach(s => {
                s.split(/\n/).forEach(ss => {
                    logger({group: name, type: 'message', data: ss, error: true});
                });
            });
        });
        p.on('error', (code) => {
            logger({group: name, type: 'not-launched', data: {cmd, args, code, path}});
            throw new Error(`Failed to execute ${cmd} ${args.join(' ')} in ${path} (layer: ${name}, exit-code: ${code})`);
        });
        p.on('close', (code) => {
            if (0 === code) {
                logger({group: name, type: 'completed', data: {cmd, args, code, path}});
                resolve(code);
            } else {
                if (silent) {
                    logger({group: name, type: 'completed', data: {cmd, args, code, path}});
                    resolve(code);
                } else {
                    logger({group: name, type: 'aborted', data: {cmd, args, code, path}});
                    reject(new Error(`Layer '${name}' command [${cmd} ${args.join(' ')}] exited with code [${code}] (cwd: ${path})`));
                }
            }
        });
    })
;
export const runLayer = async (layer, action, actionArgs = []) => {
    let logger: any = undefined;
    let messagesBuffer: any[] = [];
    switch (action) {
        case 'init-full':
            await runLayerCommand(layer, {}, 'terraform', 'init');
            break;
        case 'init-full-upgrade':
            await runLayerCommand(layer, {}, 'terraform', 'init', '-upgrade=true');
            break;
        case 'init':
            logger = ({ group, type, data, error }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Re-initializing terraform workspace...'});
                        break;
                    case 'message':
                        messagesBuffer.push({group, type, data, error});
                        break;
                    case 'aborted':
                        messagesBuffer.forEach(m => rawLogger(m));
                        messagesBuffer = [];
                        break;
                    case 'completed':
                        break;
                }
            };
            await runLayerCommand(layer, {logger}, 'terraform', 'init');
            break;
        case 'init-upgrade':
            logger = ({ group, type, data, error }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Re-initializing terraform workspace...'});
                        break;
                    case 'message':
                        messagesBuffer.push({group, type, data, error});
                        break;
                    case 'aborted':
                        messagesBuffer.forEach(m => rawLogger(m));
                        messagesBuffer = [];
                        break;
                    case 'completed':
                        break;
                }
            };
            await runLayerCommand(layer, {logger}, 'terraform', 'init', '-upgrade=true');
            break;
        case 'get':
            await runLayerCommand(layer, {}, 'terraform', 'get');
            break;
        case 'providers-lock':
            await runLayerCommand(layer, {}, 'terraform', 'providers', 'lock');
            break;
        case 'update':
            await runLayerCommand(layer, {}, 'terraform', 'get', '-update');
            break;
        case 'plan':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-out', 'plan.tfplan');
            break;
        case 'refresh':
            await runLayerCommand(layer, {}, 'terraform', 'refresh');
            break;
        case 'apply':
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            break;
        case 'output-json':
            logger = ({ group, type, data, error }) => {
                switch (type) {
                    case 'message':
                        if (error) {
                            rawLogger({group, type, data, error});
                        } else {
                            messagesBuffer.push(data);
                        }
                        break;
                    case 'completed':
                        console.log(JSON.stringify({id: group, variables: JSON.parse(messagesBuffer.join("\n"))}));
                        break;
                    default:
                }
            };
            await runLayerCommand(layer, {logger, silent: true}, 'terraform', 'output', '-json', '-no-color');
            break;
        case 'output':
            await runLayerCommand(layer, {silent: true}, 'terraform', 'output');
            break;
        case 'sync':
            let needApply: any = undefined;
            logger = ({ group, type, data, error }) => {
                switch (type) {
                    case 'starting':
                        rawLogger({group, type: 'message', data: 'Planning changes...'});
                        break;
                    case 'message':
                        if (undefined === needApply) {
                            if (/ 0 to add, 0 to change, 0 to destroy/.test(data)) {
                                needApply = false;
                            } else if (/To perform exactly these actions, run the following command to apply/.test(data)) {
                                needApply = true;
                                messagesBuffer.forEach(m => rawLogger(m));
                                messagesBuffer = [];
                            } else if (/No changes. Infrastructure is up-to-date./.test(data)) {
                                needApply = false;
                            }
                        }
                        if (needApply) {
                            rawLogger({group, type, data, error});
                        } else {
                            messagesBuffer.push({group, type, data, error});
                        }
                        break;
                    case 'aborted':
                        needApply = false;
                        messagesBuffer.forEach(m => rawLogger(m));
                        messagesBuffer = [];
                        break;
                    case 'completed':
                        if (!needApply) {
                            rawLogger({group, type: 'message', data: 'No changes detected, skipping.'})
                        } else {
                            messagesBuffer.forEach(m => rawLogger(m));
                            messagesBuffer = [];
                        }
                        break;
                }
            };
            await runLayerCommand(layer, {logger}, 'terraform', 'plan', '-out', 'plan.tfplan');
            if (needApply) {
                await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            }
            break;
        case 'sync-full':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-out', 'plan.tfplan');
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'plan.tfplan');
            break;
        case 'destroy':
            await runLayerCommand(layer, {}, 'terraform', 'plan', '-destroy', '-out', 'destroy.tfplan');
            await runLayerCommand(layer, {}, 'terraform', 'apply', 'destroy.tfplan');
            break;
        default:
            throw new Error(`Unsupported layer action '${action}'`);
    }
};

export const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
;

export const buildLayer = async (root, env, name) => {
    const dir = `${root}/${env}/${name}`;
    if (!existsSync(dir)) throw new Error(`Unknown layer '${name}'`);
    const paths = {
        '.': resolve(dir),
        'main.tf': resolve(`${dir}/main.tf`),
        'outputs.tf': resolve(`${dir}/outputs.tf`),
        'variables.tf': resolve(`${dir}/variables.tf`),
    };
    const requires: any[] = [];
    const s = readFileSync(paths['main.tf'], 'utf8');
    let array1;
    const pattern = new RegExp('data "terraform_remote_state" "([^"]+)" {', 'g');
    while ((array1 = pattern.exec(s)) !== null) {
        requires.push(array1[1].replace(/_/g, '-'));
    }
    return { name, path: paths['.'], requires, paths };
};

export const buildLayerRequires = async (layer, layers) =>
    Object.keys(<any>(await Promise.all(layer.requires.map(async r => {
        const lll = layers.find(ll => ll.name === r);
        if (!lll) return [];
        return [...await buildLayerRequires(lll, layers), lll.name];
    }))).reduce((acc, rrr) => {
        (<any>rrr).forEach(rrrr => {
            if (!(<any>acc)[rrrr]) {
                (<any>acc)[rrrr] = true;
            }
        });
        return acc;
    }, {}))
;

export const buildLayerDepends = async (layer: any, layers: any) =>
    Object.keys(<any>(await Promise.all(Object.values(<any>layers).reduce((acc: any[], l: any) => {
        if (!!l.requires.find((r: any) => r === layer.name)) (<any>acc).push(<any>l);
        return acc;
    }, <any>[]).map(async l => [...await buildLayerDepends(l, layers), l.name]))).reduce((acc: any, d: any = []) => {
        d.forEach(dd => !acc[dd] && (acc[dd] = true));
        return acc;
    }, {}))
;

export const buildLayers = async (root, env) => {
    const layers = await Promise.all(getDirectories(`${root}/${env}`).map(l => buildLayer(root, env, l)));
    const sorted = (await Promise.all(layers.map(async l => {
        const requires = await buildLayerRequires(l, layers);
        const depends = await buildLayerDepends(l, layers);
        return ({...l, requires, depends});
    })));
    sorted.sort((a, b) => {
        let r: any = undefined;
        if (a.requires.find(x => b.name === x)) {
            r = 1;
        } else if (b.requires.find(x => a.name === x)) {
            r = -1;
        } else if (a.requires.length > b.requires.length) {
            r = 1;
        } else if (a.requires.length < b.requires.length) {
            r = -1
        } else {
            r = 0;
        }
        return r;
    });
    return sorted;
};

export const runLayers = async (root, env, layerNames, action, actionArgs, opts) => {
    const layers = await buildLayers(root, env);
    const allMode = !!layerNames.find(n => n === 'all');
    layerNames = allMode ? layers.map(l => l.name) : layerNames;
    layerNames = layerNames.reduce((acc, ln) => {
        if (/\*/.test(ln)) {
            const lnr = new RegExp(ln.replace(/\*/, '[^/]+'));
            acc = [...acc, ...layers.filter(l => lnr.test(l.name)).map(l => l.name)];
        } else {
            acc.push(ln);
        }
        return acc;
    }, []);
    const done = {};
    await layers.filter(l => layerNames.find(n => n === l.name)).reduce(async (p, l) => {
        await p;
        if (opts.transitive && actions[action].executeRequires) {
            await l.requires.reduce(async (p, ll) => {
                await p;
                if (!done[ll]) {
                    await runLayer(layers.find(x => ll === x.name), action, actionArgs);
                    done[ll] = true;
                }
            }, Promise.resolve());
        }
        if (!done[l.name]) {
            await runLayer(l, action, actionArgs);
            done[l.name] = true;
        }
        if (opts.transitive && !allMode && actions[action].executeDepends) {
            await l.depends.reduce(async (p, ll) => {
                await p;
                if (!done[ll]) {
                    await runLayer(layers.find(x => ll === x.name), action, actionArgs);
                    done[ll] = true;
                }
            }, Promise.resolve());
        }
    }, Promise.resolve());
};
export const tflayer = ({layerNameString, env, action, actionArgs, targetDir}) => {
    let layerNames = [];
    const opts = {transitive: false};
    if (/\+$/.test(layerNameString)) {
        layerNames = layerNameString.substr(0, -1).split(/,/);
        opts.transitive = true;
    } else {
        layerNames = (layerNameString || 'all').split(/,/)
    }
    if (action === 'list-layers') return buildLayers(targetDir, env).then(layers => {
        console.log(Object.values(layers).map(l => l.name).join("\n"));
        process.exit(0);
    });
    return runLayers(targetDir, env, layerNames, action, actionArgs, opts)
};
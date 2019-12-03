const { writeFileSync } = require('fs');
const { execSync } = require('child_process');

const buildSequence = (steps, actions) => actions.reduce((acc, action) => {
    const s = steps[action];
    if (!Array.isArray(s)) {
        if (!s) throw new Error(`Unknown step '${action}'`);
        acc.push(s);
    } else {
        acc.push(...buildSequence(steps, s));
    }
    return acc;
}, []);

const buildTerraformBackendConfig = config => {
    if (!config || !config.terraform || !config.terraform.backend) {
        return '';
    }
    return Object.entries(config.terraform.backend).reduce((acc, [k, v]) => {
        acc.push(`-backend-config="${k}=${v}"`);
        return acc;
    }, <string[]>[]).join(' ');
};

export default (action, steps, config: {[key: string]: any} = {}) => {
    const env = config.env || process.env;
    config.env = (k, d = '') => env[k] || d;
    config.exit = config.exit || process.exit;
    config.log = config.log || console.log;
    config.error = config.error || console.error;
    config.cwd = config.cwd || process.cwd;
    config.result = config.result || (() => ({}));
    const write = (path, content) => writeFileSync(path, content || '');
    const write_merged_json = (path, json) => write(path, JSON.stringify({...require(path), ...((('string' === typeof json) ? JSON.parse(json || '{}') : json) || {})}));
    const exec = (command, cwd = undefined, envs = undefined) => execSync(command, {cwd: cwd || config.cwd(), env: envs || env, encoding: 'utf8'});
    const rm = (path) => exec(`rm -rf ${path}`);
    const copy = (source, target) => {rm(target); exec(`cp -R ${source} ${target}`);};
    const tf = (action) => exec(`terraform ${action}`, undefined, <any>{...env, AWS_SDK_LOAD_CONFIG: 1});
    const aws = (action) => exec(`aws ${action}`, undefined, <any>{...env, AWS_SDK_LOAD_CONFIG: 1});
    const run = async (action, steps) => buildSequence(steps, action.split(/\s*,\s*/)).reduce(async (acc, s) => {await acc; return s();}, Promise.resolve());
    const success = result => aws(`stepfunctions send-task-success --task-token ${config.env('TASK_TOKEN')} --task-output '${JSON.stringify(result)}'`);
    const failure = (error, cause) => aws(`stepfunctions send-task-failure --task-token ${config.env('TASK_TOKEN')} --error "${error}" --cause "${cause}"`);
    const fs: {[key: string]: Function} = {write, write_merged_json, rm, copy};
    const terraform: {[key: string]: Function} = {
        init:         () => tf(`init ${buildTerraformBackendConfig(config)}`),
        apply:        () => tf('apply -no-color -input=false plan.tfplan'),
        plan:         () => tf('plan -out=plan.tfplan -no-color -input=false'),
        plan_destroy: () => tf('plan -destroy -out=plan.tfplan -no-color -input=false'),
        output_json:  () => JSON.parse(tf('output -json -no-color')),
    };
    terraform.destroy = () => [terraform.init, terraform.plan_destroy, terraform.apply].forEach(f => f());

    const vars = {...config, fs, aws, exec, terraform};
    steps = ('function' === typeof steps) ? steps(vars) : steps;
    const defaultSteps = {
        help: () => config.log(`Available commands: ${Object.keys(steps).join(', ')}`),
        noop: () => {},
        result: () => config.log(config.result(vars)),
    };
    return run(action || 'help', {...defaultSteps, ...steps}).then(() => {
        try {
            !config.env('NO_NOTIFY') && (config.success || success)(config.result(vars));
            config.exit(0);
        } catch (e) {
            !config.env('NO_NOTIFY') && (config.failure || failure)('notify-success', e.message);
            config.error(`Error: ${e.message}`);
            config.exit(2);
        }
    }).catch(e => {
        !config.env('NO_NOTIFY') && (config.failure || failure)('run', e.message);
        config.error(`Error: ${e.message}`);
        config.exit(1);
    });
};
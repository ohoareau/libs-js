import {s3} from '@ohoareau/aws';
import {createRunner} from '@ohoareau/topper';

const plugin = (source, {run, ruleName, plugins, targetBucket = undefined, processedDir = 'archived/processed/:rule', errorsDir = 'archived/errors/:rule'}) => async (bucket, key) => {
    ruleName = ruleName || 'unknown-rule';
    targetBucket = targetBucket || bucket;
    let p = plugins[source];
    ('function' === typeof p) && (p = {
        init: <Function>(async x => ({...x})),
        load: <Function>(async () => {}),
        execute: p,
        clean: <Function>(async () => {}),
    });
    processedDir = processedDir.replace(':rule', ruleName);
    errorsDir = errorsDir.replace(':rule', ruleName);
    const getData = async () => s3.getFileContent({bucket, key, raw: true});
    const getTargetObject = to => ({bucket: targetBucket, key: `${to ? to : ''}${to ? '/' : ''}${key}`});
    const copyFileFactory = to => async () => s3.setFileContent(getTargetObject(to), await getData());
    const ctx = await p.init({source, run, log: console.log, error: console.error});
    const processedTargetObject = getTargetObject(processedDir);
    const errorsTargetObject = getTargetObject(errorsDir);
    const formatObjectPath = o => `s3://${o.bucket}/${o.key}`;
    const processedTargetPath = formatObjectPath(processedTargetObject);
    const errorsTargetPath = formatObjectPath(errorsTargetObject);
    const defaults = {getData, bucket, key, source};
    const originalPath = formatObjectPath({bucket, key});
    await run(
        ['process', `rule: ${ruleName}, file: ${originalPath}`],
        async () => {
            p.load && (await run('load', async () => p.load({...defaults}, ctx)));
            p.execute && (await run('execute', async () => p.execute({...defaults}, ctx)));
            await run(['archive', processedTargetPath], copyFileFactory(processedDir));
        },
        async e => {
            p.fail && (await run('fail', async () => p.fail({...defaults, error: e}, ctx)));
            await run(['archive', errorsTargetPath], copyFileFactory(errorsDir));
            ctx.error(`File '${originalPath}' failed to be imported: ${e.message}`)
        },
        async () => {
            p.clean && (await p.clean({...defaults}, ctx));
        }
    );
};

const consumeS3 = ({eventType = 'ObjectCreated', clean = true, plugins = undefined, rules = [], ...rest}: {clean?: boolean, eventType?: string, plugins?: any, rules?: any[]}) => async record => {
    const bucket = record.s3.bucket['name'];
    const key = record.s3.object.key;
    const isHandledEventRecord = new RegExp(`^${eventType}`).test(record.eventName);
    const isDirectory = ('/' === key.charAt(key.length - 1));
    if (!isHandledEventRecord || isDirectory) {
        console.log(`Ignoring non-handled object '${key}' from bucket '${bucket}'.`)
        return;
    }
    const run = createRunner();
    const hits = rules.reduce((acc, rule) => {
        const patterns = rule.match ? (Array.isArray(rule.match) ? rule.match : [rule.match]) : [];
        const ignorePatterns = rule.ignore ? (Array.isArray(rule.ignore) ? rule.ignore : [rule.ignore]) : [];
        const foundPatternMatch = patterns.find(p => key.match(p));
        const foundIgnorePatternMatch = ignorePatterns.find(p => key.match(p));
        foundPatternMatch && !foundIgnorePatternMatch && acc.push({rule, match: foundPatternMatch});
        return acc;
    }, []);
    let error = undefined;
    try {
        await Promise.all(hits.map(async hit => {
            let fn = hit.rule.function;
            let localPlugins = plugins;
            if (hit.rule.plugin) {
                let pName = hit.rule.plugin;
                if ('string' !== typeof pName) {
                    localPlugins = {default: pName};
                    pName = 'default';
                }
                fn = plugin(pName, {...rest, run, ruleName: hit.rule.name, plugins: localPlugins})
            }
            return (fn as any)(bucket, hit.match);
        }));
    } catch (e) {
        error = e;
    }
    if (hits.length) {
        clean && (await run('clean', async () => s3.deleteFile({bucket, key})));
    } else {
        console.log(`incoming ${bucket}:${key} => IGNORED`);
    }
    if (error) throw error;
};

const consumerFactories = config => ({
    'aws:s3': consumeS3(config),
});

export default config => async ({Records = []}) => {
    const consumers = consumerFactories(config);
    return Promise.all(Records.map(async record => ((consumers[record['eventSource']] || (() => {})) as any)(record)))
};

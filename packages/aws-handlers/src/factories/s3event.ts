import {s3} from '@ohoareau/aws';
import {createRunner} from '@ohoareau/topper';

const plugin = (source, {plugins, targetBucket = undefined, processedDir = 'archived/processed', errorsDir = 'archived/errors'}) => async (bucket, key) => {
    targetBucket = targetBucket || bucket;
    let p = plugins[source];
    ('function' === typeof p) && (p = {
        init: async x => ({...x}),
        load: async () => {},
        execute: p,
        clean: async () => {},
    });
    const run = createRunner();
    const getData = async () => s3.getFileContent({bucket, key, raw: true});
    const getTargetObject = to => ({bucket: targetBucket, key: `${to ? to : ''}${to ? '/' : ''}${key}`});
    const copyFileFactory = to => async () => s3.setFileContent(getTargetObject(to), await getData());
    const deleteFile = async () => s3.deleteFile({bucket, key});
    const ctx = await p.init({source, run, log: console.log, error: console.error});
    const processedTargetObject = getTargetObject(processedDir);
    const errorsTargetObject = getTargetObject(errorsDir);
    const formatObjectPath = o => `s3://${o.bucket}/${o.key}`;
    const processedTargetPath = formatObjectPath(processedTargetObject);
    const errorsTargetPath = formatObjectPath(errorsTargetObject);
    const defaults = {getData, bucket, key, source};
    const originalPath = formatObjectPath({bucket, key});
    await run(
        ['process', originalPath],
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
            await run('clean', deleteFile);
        }
    );
};

const consumeS3 = ({eventType = 'ObjectCreated', plugins = undefined, rules, ...rest}) => async record => {
    const bucket = record.s3.bucket['name'];
    const key = record.s3.object.key;
    const isHandledEventRecord = new RegExp(`^${eventType}`).test(record.eventName);
    const isDirectory = ('/' === key.charAt(key.length - 1));
    if (!isHandledEventRecord || isDirectory) {
        console.log(`Ignoring non-handled object '${key}' from bucket '${bucket}'.`)
        return;
    }
    const hits = rules.reduce((acc, rule) => {
        const match = key.match(rule.pattern);
        match && acc.push({rule, match});
        return acc;
    }, []);
    await Promise.all(hits.map(async hit => {
        let fn = hit.rule.function;
        if (hit.rule.plugin && plugins) {
            fn = plugin(hit.rule.plugin, {...rest, plugins})
        }
        return (fn as any)(bucket, hit.match);
    }));
    !hits.length && console.log(`incoming ${bucket}:${key} => IGNORED`);
};

const consumerFactories = config => ({
    'aws:s3': consumeS3(config),
});

export default config => async ({Records = []}) => {
    const consumers = consumerFactories(config);
    return Promise.all(Records.map(async record => ((consumers[record['eventSource']] || (() => {})) as any)(record)))
};

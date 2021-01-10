const consumeS3 = ({eventType = 'ObjectCreated', rules}) => async record => {
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
    await Promise.all(hits.map(async hit => (hit.rule.function as any)(bucket, hit.match)));
    !hits.length && console.log(`incoming ${bucket}:${key} => IGNORED`);
};

const consumerFactories = config => ({
    'aws:s3': consumeS3(config),
});

export default config => async ({Records = []}) => {
    const consumers = consumerFactories(config);
    return Promise.all(Records.map(async record => ((consumers[record['eventSource']] || (() => {})) as any)(record)))
};

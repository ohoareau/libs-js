const consumeS3 = ({rules}) => async record => {
    if (!/^ObjectCreated:/.test(record.eventName)) return;
    if ('/' === record.s3.object.key.charAt(record.s3.object.key.length - 1)) return;
    const hits = rules.reduce((acc, rule) => {
        const match = record.s3.object.key.match(rule.pattern);
        match && acc.push({rule, match});
        return acc;
    }, []);
    await Promise.all(hits.map(async hit => hit.rule.function(record.s3.bucket.name, hit.match)));
    !hits.length && console.log(`incoming ${record.s3.bucket.name}:${record.s3.object.key} => IGNORED`);
};

const consumerFactories = config => ({
    'aws:s3': consumeS3(config),
});

export default config => async ({Records = []}) => {
    const consumers = consumerFactories(config);
    return Promise.all(Records.map(async record => ((consumers[record['eventSource']] || (() => {})) as any)(record)))
};

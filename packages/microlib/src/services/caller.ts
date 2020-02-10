const inferArnIfPossible = dsn => {
    const upperCasedName = `${dsn.toUpperCase().replace(/[^A-Z0-9_]+/g, '_')}`;
    const sluggedName = dsn.replace(/\./g, '-');
    const tries = [
        `MICROSERVICE_${upperCasedName}_LAMBDA_ARN`,
        'MICROSERVICE_PATTERN_LAMBDA_OPERATION_ARN',
    ];
    const arn = tries.map(t => process.env[t]).filter(v => !!v).find(v => !!v);
    return !!arn ? arn.replace('{name}', sluggedName) : undefined;
};

const executeLocal = async (operation, params) => {
    const tokens = operation.split(/_/g);
    const op = tokens.pop();
    return require(`./crud/${tokens.join('_')}`)[op](params);
};

const executeRemoteLambda = async (arn, params) =>
    require('./aws/lambda').execute(arn, {params})
;

const executeRemote = async (dsn, params) => {
    const arn = inferArnIfPossible(dsn);
    if (!arn) throw new Error(`Unknown remote operation '${dsn}'`);
    return executeRemoteLambda(arn, params);
};

const execute = async (dsn, params) => {
    const arn = inferArnIfPossible(dsn);
    if (!!arn) return executeRemoteLambda(arn, params);
    return executeLocal(dsn, params);
};

export default {execute, executeLocal, executeRemote, executeRemoteLambda}


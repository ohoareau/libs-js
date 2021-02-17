let config: any|undefined = undefined;
const root = process.env.LAMBDA_TASK_ROOT;

export async function getLambdaConfig() {
    if (config) return config;

    config = config || {root, ...(await require(`${root}/config`)())};
    config.statics = {...(config.statics || {}), ...(await require(`${root}/config-statics`)())}

    return config;
}

export default getLambdaConfig
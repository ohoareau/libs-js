let config: any|undefined = undefined;
const root = process.env.LAMBDA_TASK_ROOT;

export async function getLambdaConfig() {
    return config || {root, ...(await require(`${root}/config`)())};
}

export default getLambdaConfig
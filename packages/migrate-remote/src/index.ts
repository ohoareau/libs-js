import * as migrators from './migrators';

async function buildOptions(rawOptions: any = {}): Promise<any> {
    const options = {...rawOptions};

    process.env.MIGRATE_AUTH_USERNAME && (options['username'] = process.env.MIGRATE_AUTH_USERNAME);
    process.env.MIGRATE_AUTH_PASSWORD && (options['password'] = process.env.MIGRATE_AUTH_PASSWORD);
    process.env.MIGRATE_DEBUG && (options['debug'] = true);

    return options;
}

async function migrateRemote(type, endpoint, options: any = {}) {
    if (!migrators[type]) throw new Error(`Unknown remote migrator '${type}'`);
    return migrators[type](endpoint, await buildOptions(options));
}

export default migrateRemote
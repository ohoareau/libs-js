import {existsSync, readdirSync} from 'fs';

export class MigrateError extends Error {
    protected result: {planned: string[], failed: string[], failures: {[key: string]: string}, deployed: string[]};
    constructor(result: {planned: string[], failed: string[], failures: {[key: string]: string}, deployed: string[]}) {
        super(`Migrate error`);
        this.result = result;
    }
    getResult(): {planned: string[], failed: string[], failures: {[key: string]: string}, deployed: string[]} {
        return this.result;
    }
}
export const plan = async (repo: string, deployed: string[], action: string): Promise<string[]> => {
    if (!existsSync(repo)) return [];
    let all: string[] = readdirSync(repo, {withFileTypes: true}).filter(e => !e.isDirectory() && /.js$/.test(e.name)).map(e => e.name);
    switch (action) {
        case 'up':
            all = all.filter(x => !deployed.includes(x));
            all.sort();
            break;
        case 'down':
            all = all.filter(x => deployed.includes(x));
            all = all.reverse();
            break;
        default:
            throw new Error(`Unsupported plan action '${action}' (allowed: up, down)`);
    }
    return all;
};

export const migrationLoggerFactory = (migration, logger) => ({
    log: async (...args) => {
        await logger('migrationLog', {...migration, args});
    },
    error: async (...args) => {
        await logger('migrationLogError', {...migration, args});
    },
});

export const applyMigration = async (repo: string, migration: string, ctx: {[key: string]: any}, action: string, logger: Function): Promise<void> => {
    try {
        const m = require(`${repo}/${migration}`);
        if (!m[action]) {
            throw new Error(`Unknown action '${action}' for migration '${migration}' (repo: ${repo})`);
        }
        const r = await m[action](ctx, {logger: migrationLoggerFactory({name: migration, action}, logger)});
        await logger('migrationSucceed', {name: migration, action});
        return r;
    } catch (e) {
        await logger('migrationFailed', {name: migration, action, error: e});
        throw e;
    }
};

export default async (repo: string, deployed: string[], ctx: {[key: string]: any}, action: string, logger: Function): Promise<any> => {
    const toDeploy = await plan(repo, deployed, action);
    const result = {planned: toDeploy, failed: <string[]>[], failures: <{[key: string]: string}>{}, deployed: <string[]>[]};
    if (!toDeploy.length) {
        await logger('migrateSkipped', {...result});
        return result;
    }
    await logger('migrateStarting', {...result});
    result.deployed = [];
    result.failed = [];
    result.failures = {};
    try {
        if (1 === toDeploy.length) {
            try {
                await applyMigration(repo, toDeploy[0], ctx, action, logger);
                result.deployed.push(toDeploy[0]);
            } catch (e) {
                result.failed.push(toDeploy[0]);
                result.failures[toDeploy[0]] = e.message;
                throw e;
            }
        } else {
            const localToDeploy = [...toDeploy];
            const firstI = <string>localToDeploy.shift();
            const rr = await localToDeploy.reduce(async (acc, i) => {
                const r = await acc;
                try {
                    await r[1];
                    result.deployed.push(<string>r[0]);
                } catch (e) {
                    result.failed.push(<string>r[0]);
                    result.failures[<string>r[0]] = e.message;
                    throw e;
                }
                return [<string>i, applyMigration(repo, i, ctx, action, logger)];
            }, Promise.resolve([<string>firstI, applyMigration(repo, firstI, ctx, action, logger)]));
            try {
                await rr[1];
                result.deployed.push(<string>rr[0]);
            } catch (e) {
                result.failed.push(<string>rr[0]);
                result.failures[<string>rr[0]] = e.message;
                throw e;
            }
        }
    } catch (e) {
        await logger('migrateFailed', {...result});
        throw new MigrateError(result);
    }
    await logger('migrateCompleted', {...result});
    return result;
};


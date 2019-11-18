import { readdirSync } from "fs";

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

export const applyMigration = async (repo: string, migration: string, ctx: {[key: string]: any}, action: string, logger: Function): Promise<void> => {
    try {
        const m = require(`${repo}/${migration}`);
        if (!m[action]) {
            throw new Error(`Unknown action '${action}' for migration '${migration}' (repo: ${repo})`);
        }
        return m[action](ctx);
    } catch (e) {
        await logger('migrationFailed', {name: migration, error: e});
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
        await [...toDeploy, ''].reduce(async (acc: Promise<[string, Promise<any>]>, i: string): Promise<[string, Promise<any>]> => {
            const r = await acc;
            try {
                await r[1];
                if (r[0].length) {
                    result.deployed.push(<string>r[0]);
                }
            } catch (e) {
                result.failed.push(<string>r[0]);
                result.failures[<string>r[0]] = e.message;
                await logger('migrationFailed', {...result});
                throw new Error('Failure');
            }
            if (i.length) {
                return [<string>i, <Promise<any>>applyMigration(repo, i, ctx, action, logger)];
            }
            return [<string>i, Promise.resolve()];
        }, Promise.resolve([<string>'', <Promise<any>>Promise.resolve()]));
    } catch (e) {
        await logger('migrateFailed', {...result});
        throw new MigrateError(result);
    }
    await logger('migrateCompleted', {...result});
    return result;
};

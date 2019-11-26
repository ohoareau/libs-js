import {Config, RootConfig, Map, Handler} from "..";
import migrate from "@ohoareau/migrate";
import dynamodbFactory from "../factories/dynamodb";

export const factory = (ctx, c: Config) => {
    ctx.migrationService || (ctx.migrationService = dynamodbFactory({
        name: 'migration',
        schema: {
            id: {type: String, hashKey: true, required: true},
        },
        schemaOptions: {
            timestamps: true,
        },
        options: {
            create: false, update: false, waitForActive: false,
        },
    }));
    return async (event: any) => {
        await migrate(
            <string>c.migration,
            (await ctx.migrationService.find({})).items.map(i => i.id),
            {},
            event.action || 'up',
            createLogger({
                add: async (migration: {name: string}): Promise<any> =>
                    ctx.migrationService.create({data: {id: migration.name}})
                ,
                remove: async (migration: {name: string}): Promise<any> =>
                    ctx.migrationService.delete({id: migration.name})
                ,
            })
        );
    };
};

export const createLogger = ({add, remove}): Function => async (event, data): Promise<void>  => {
    switch (event) {
        case 'migrationLog':
            console.log(`[migration-${data.action}(${data.name})]`, ...data.args);
            break;
        case 'migrationLogError':
            console.error(`[migration-${data.action}(${data.name})]`, ...data.args);
            break;
        case 'migrationSucceed':
            switch (data.action) {
                case 'up':
                    await add(data);
                    console.log(`Migration '${data.name}' succeed (up), add to db`);
                    break;
                case 'down':
                    await remove(data);
                    console.log(`Migration '${data.name}' succeed (down), removed from db`);
                    break;
            }
            break;
        case 'migrationFailed':
            console.log(`Migration '${data.name}' failed with message: ${data.error.message}`, data.error);
            break;
        case 'migrateStarting':
            console.log(`Starting migration process with ${data.planned.length} migrations selected [${data.planned.join(', ')}]`);
            break;
        case 'migrateSkipped':
            console.log(`No migrations to deploy, skipping.`);
            break;
        case 'migrateCompleted':
            console.log(`Completed migration process with ${data.planned.length} migrations selected and ${data.deployed.length} migrations deployed [${data.deployed.join(', ')}]`);
            break;
        case 'migrateFailed':
            console.log(`Failed migration process with ${data.planned.length} migrations selected and ${data.deployed.length} migrations deployed [${data.deployed.join(', ')}] and ${data.failed.length} migrations failed [${data.failed.join(', ')}]`);
            break;
        default:
            break;
    }
};

export default (c: RootConfig, handlers: Map<Handler>) => {
    const configs = c.types.filter(t => !!t.migration);
    if (!configs || (0 === configs.length)) return;
    handlers.migrate = async (...args) => {
        await configs.map(config => factory(c, config)).reduce(async (acc, f: Function) => {
            await acc;
            return f(...args);
        }, Promise.resolve());
    };
}
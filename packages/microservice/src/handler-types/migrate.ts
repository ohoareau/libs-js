import {Service, TypeConfig} from "../types";
import migrate from "@ohoareau/migrate";

export default (_, typeConfig: TypeConfig) => async (event: any, context: any) => {
    const s = <Service>(<TypeConfig>typeConfig).service;
    await migrate(
        <string>typeConfig.migration,
        (await s.find()).items.map(i => i.id),
        {service: (<TypeConfig>typeConfig.parentType).service},
        event.action || 'up',
        createLogger({
            add: async (migration: {name: string}): Promise<void> => {
                await s.create({id: migration.name});
            },
            remove: async (migration: {name: string}): Promise<void> => {
                await s.delete(migration.name);
            },
        })
    );
};

export const createLogger = ({ add, remove, }): Function =>
    async (event, data): Promise<void>  => {
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

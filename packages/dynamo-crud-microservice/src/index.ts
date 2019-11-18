import crud from '@ohoareau/dynamo-crud';
import migrate from '@ohoareau/migrate';
import AWS from 'aws-sdk';

const buildQueueUrlFromArn = (sqs, arn): string => {
    const splits = arn.split(':');
    return sqs.endpoint.href + splits[4] + '/' + splits[5];
};
const sqs = new AWS.SQS();

export default (definition): any => {
    const crudService = crud(definition);
    const { get, find, update, remove, create } = crudService;
    const t = `${definition.type.substr(0, 1).toUpperCase()}${definition.type.substr(1)}`;
    const st = `${definition.type.substr(0, 1).toLowerCase()}${definition.type.substr(1)}`;
    const ts = `${t}s`;
    const handlers: {[key: string]: any} = {
        [`get${t}`]: ({ params: { id } }) => get(id),
        [`get${ts}`]: () => find(),
        [`update${t}`]: ({ params: { id, input } }) => update(id, input),
        [`delete${t}`]: ({ params: { id } }) => remove(id),
        [`create${t}`]: ({ params: { input } }) => create(input),
        [`${st}Service`]: crudService,
    };
    if (definition.migrations) {
        handlers.migrate = async event => {
            const ctx = {
                operation: async(name: string, data: {[key: string]: any}): Promise<any> => {
                    console.log('@todo implement operation in ctx', name, data);
                }
            };
            const fetchMigrationsFromDb = async (): Promise<string[]> => {
                console.log('@todo implement fetch list of migrations from db');
                return [];
            };
            const addMigrationToDb = async (migration: {data: string}): Promise<void> => {
                console.log('@todo update db to add migration entry', migration);
            };
            const removeMigrationFromDb = async (migration: {data: string}): Promise<void> => {
                console.log('@todo update db to remove migration entry', migration);
            };
            const logger = async (event, data): Promise<void>  => {
                switch (event) {
                    case 'migrationSucceed':
                        switch (data.action) {
                            case 'up':
                                await addMigrationToDb(data);
                                console.log(`Migration '${data.name}' succeed (up), add to db`);
                                break;
                            case 'down':
                                await removeMigrationFromDb(data);
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
                        console.log(`Completed migration process with ${data.planned.length} migrations selected and ${data.deployed} migrations deployed [${data.deployed.join(', ')}]`);
                        break;
                    case 'migrateFailed':
                        console.log(`Failed migration process with ${data.planned.length} migrations selected and ${data.deployed} migrations deployed [${data.deployed.join(', ')}] and ${data.failed} migrations failed [${data.failed.join(', ')}]`);
                        break;
                    default:
                        break;
                }
            };
            await migrate(
                definition.migrations,
                await fetchMigrationsFromDb(),
                ctx,
                event.action || 'up',
                logger
            )
        };
    }
    if (definition.receiveExternalEvents) {
        handlers.receiveExternalEvents = async (event, context) => {
            if (!event.Records || !event.Records.length) {
                return;
            }
            await Promise.all(event.Records.map(async r => {
                const receiptHandle = r.receiptHandle;
                const body = JSON.parse(r.body);
                const eventType = body.MessageAttributes.fullType.Value.toLowerCase().replace(/_/, '.');
                const queueUrl = buildQueueUrlFromArn(sqs, r.eventSourceARN);
                if (definition.receiveExternalEvents[eventType]) {
                    const attributes = Object.keys(body.MessageAttributes).reduce((acc, k) => {
                        acc[k] = body.MessageAttributes[k].Value;
                        return acc;
                    }, {});
                    await definition.receiveExternalEvents[eventType](JSON.parse(body.Message), {
                        attributes,
                        service: crudService,
                        type: definition.type,
                        context,
                        queueUrl,
                        receiptHandle,
                    });
                }
                sqs.deleteMessage({QueueUrl: queueUrl, ReceiptHandle: receiptHandle});
            }));
        };
    }
    return handlers;
};
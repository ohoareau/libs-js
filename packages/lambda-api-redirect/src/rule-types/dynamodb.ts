import {dynamodb as awsdynamodb} from '@ohoareau/aws';

export async function dynamodb({table, index = undefined, key = 'id', path}: {table: string, index?: string, key?: string, path: string}) {
    const tablePrefix = process.env[`DYNAMODB_${table.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || undefined;
    table = tablePrefix ? `${tablePrefix}${table}` : table;
    try {
        const page = await awsdynamodb.queryIndex(table, {[key]: path}, index);
        if (!page || !page.items || !page.items.length) return undefined;
        const data = page.items[0];
        if (!data || !data.location) return undefined;
        return {...data};
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
import {ctx} from '@ohoareau/lambda-utils';
import {dynamodb as awsdynamodb} from '@ohoareau/aws';

export async function dynamodb(ctx: ctx) {
    let {table = process.env.REDIRECT_DYNAMODB_TABLE, index = process.env.REDIRECT_DYNAMODB_INDEX, key = process.env.REDIRECT_DYNAMODB_KEY} = ctx.query;
    const tablePrefix = process.env[`DYNAMODB_${table.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || undefined;
    table = tablePrefix ? `${tablePrefix}${table}` : table;
    try {
        const page = await awsdynamodb.queryIndex(table, {[key]: ctx.query.file}, index);
        if (!page || !page.items || !page.items.length) return undefined;
        const data = page.items[0];
        if (!data || !data.location) return undefined;
        return {...data};
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
const db = new (require('aws-sdk/clients/dynamodb').DocumentClient);

const buildTableName = name => `${process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || ''}${name}${process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_SUFFIX`] || process.env.DYNAMODB_TABLE_SUFFIX || ''}`;
const buildReturns = returns => {
    returns = {
        values: 'NONE',
        consumedCapacity: 'NONE',
        itemCollectionMetrics: 'NONE',
        valuesOnConditionCheckFailure: 'NONE',
        ...(returns || {}),
    };
    return {
        ReturnValues: returns.values,
        ReturnConsumedCapacity: returns.consumedCapacity,
        ReturnItemCollectionMetrics: returns.itemCollectionMetrics,
        ReturnValuesOnConditionCheckFailure: returns.valuesOnConditionCheckFailure,
    };
};
const buildParams = (table, key, returns = undefined, extra = {}) => ({TableName: buildTableName(table), Key: key, ...buildReturns(returns), ...extra});
const buildExpressionParams = (filter, prefix, first, between) =>
    (!filter || !Object.keys(filter).length)
        ? {}
        : Object.entries(filter).reduce((acc, [k, v], i) => {
            const kk = `#K${i}`;
            const vv = `:v${i}`;
            acc.ExpressionAttributeNames[kk] = k;
            acc.ExpressionAttributeValues[vv] = v;
            acc[`${prefix}Expression`] = `${acc[`${prefix}Expression`] || ''}${acc[`${prefix}Expression`] ? between : first}${kk} = ${vv}`;
            return acc;
        }, {ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, [`${prefix}Expression`]: undefined})
;
const buildUpdateParams = (table, key, data, returns = undefined) => ({
    ...buildParams(table, key, returns),
    ...buildExpressionParams(data, 'Update', 'SET ', ', '),
});

const buildQueryParams = (table, index, key) => ({
    TableName: buildTableName(table),
    IndexName: index,
    ...buildExpressionParams(key, 'KeyCondition', '', ' and '),
});
const buildScanParams = (table, filter = {}, index = undefined) => ({
    TableName: buildTableName(table),
    ...(index ? {IndexName: index} : {}),
    ...buildExpressionParams(filter, 'Filter', '', ' and '),
});
const mutateResult = r => ({
    items: r.Items,
    count: r.Count,
    scannedCount: r.ScannedCount,
});
module.exports = {
    delete: async (table, key, returns = undefined) => db.delete(buildParams(table, key, returns)).promise(),
    upsert: async (table, key, data, returns = undefined) => db.update(buildUpdateParams(table, key, data, returns)).promise(),
    queryIndex: async (table, index, key) => mutateResult(await db.query(buildQueryParams(table, index, key)).promise()),
    scanIndex: async (table, index, filter = {}) => mutateResult(await db.scan(buildScanParams(table, filter, index)).promise()),
    scan: async (table, filter = {}) => mutateResult(await db.scan(buildScanParams(table, filter)).promise()),
};
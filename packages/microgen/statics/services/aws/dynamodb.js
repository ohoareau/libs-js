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
const buildOperationString = (v, kk, i) => {
    if ('object' === typeof v) {
        const {type, ...params} = v;
        const vv = `:v${i}`;
        switch (type) {
            case 'beginsWith': return [[[vv, params.value]], `begins_with(${kk}, ${vv})`];
            case 'eq': return [[[vv, params.value]], `${kk} = ${vv}`];
            case 'lt': return [[[vv, params.value]], `${kk} < ${vv}`];
            case 'le': return [[[vv, params.value]], `${kk} <= ${vv}`];
            case 'gt': return [[[vv, params.value]], `${kk} > ${vv}`];
            case 'ge': return [[[vv, params.value]], `${kk} >= ${vv}`];
            case 'between': return [[[`${vv}a`, params.lowerBound], [`${vv}b`, params.upperBound]], `${kk} BETWEEN ${vv}a AND ${vv}b`];
        }
    }
    return [[[`:v${i}`, v]], `${kk} = :v${i}`];
};
const buildParams = (table, key, returns = undefined, extra = {}) => ({TableName: buildTableName(table), Key: key, ...buildReturns(returns), ...extra});
const buildExpressionParams = (filter, prefix, first, between, operationMode = true) =>
    (!filter || !Object.keys(filter).length)
        ? {}
        : Object.entries(filter).reduce((acc, [k, v], i) => {
            const kk = `#K${i}`;
            const [vvv, op] = operationMode ? buildOperationString(v, kk, i) : [[[`:v${i}`, v]], `${kk} = :v${i}`];
            acc.ExpressionAttributeNames[kk] = k;
            vvv.forEach(vv => {
                acc.ExpressionAttributeValues[vv[0]] = vv[1];
            });
            acc[`${prefix}Expression`] = `${acc[`${prefix}Expression`] || ''}${acc[`${prefix}Expression`] ? between : first}${op}`;
            return acc;
        }, {ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, [`${prefix}Expression`]: undefined})
;
const buildUpdateParams = (table, key, data, returns = undefined) => ({
    ...buildParams(table, key, returns),
    ...buildExpressionParams(data, 'Update', 'SET ', ', ', false),
});

const buildQueryParams = (table, key, index = undefined) => ({
    TableName: buildTableName(table),
    ...(index ? {IndexName: index} : {}),
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
    queryIndex: async (table, index, key) => mutateResult(await db.query(buildQueryParams(table, key, index)).promise()),
    query: async (table, key) => mutateResult(await db.query(buildQueryParams(table, key)).promise()),
    scanIndex: async (table, index, filter = {}) => mutateResult(await db.scan(buildScanParams(table, filter, index)).promise()),
    scan: async (table, filter = {}) => mutateResult(await db.scan(buildScanParams(table, filter)).promise()),
};
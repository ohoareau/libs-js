const awsdb = new (require('aws-sdk/clients/dynamodb').DocumentClient);

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
const buildParams = (table, key, returns: any = undefined, extra = {}) => ({TableName: buildTableName(table), Key: key, ...buildReturns(returns), ...extra});
const buildExpressionParams = (filter, prefix, first, between, operationMode = true) =>
    (!filter || !Object.keys(filter).length)
        ? {}
        : Object.entries(filter).reduce((acc, [k, v], i) => {
            const kk = `#K${i}`;
            const [vvv, op] = operationMode ? buildOperationString(v, kk, i) : [[[`:v${i}`, v]], `${kk} = :v${i}`];
            acc.ExpressionAttributeNames[kk] = k;
            (<any[]>vvv).forEach(vv => {
                acc.ExpressionAttributeValues[vv[0]] = vv[1];
            });
            acc[`${prefix}Expression`] = `${acc[`${prefix}Expression`] || ''}${acc[`${prefix}Expression`] ? between : first}${op}`;
            return acc;
        }, {ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, [`${prefix}Expression`]: undefined})
;
const buildUpdateParams = (table, key, data, returns: any = undefined) => ({
    ...buildParams(table, key, returns),
    ...buildExpressionParams(data, 'Update', 'SET ', ', ', false),
});

const buildQueryParams = (table, key, index = undefined) => ({
    TableName: buildTableName(table),
    ...(index ? {IndexName: index} : {}),
    ...buildExpressionParams(key, 'KeyCondition', '', ' and '),
});
const buildGetParams = (table, key, index = undefined, returns = undefined) => ({
    ...(index ? {IndexName: index} : {}),
    ...buildParams(table, key, returns),
});
const buildCreateParams = (table, key, data: any = {}, returns = undefined) => ({
    Attributes: data,
    ...buildParams(table, key, returns),
});
const buildScanParams = (table, filter = {}, index = undefined) => ({
    TableName: buildTableName(table),
    ...(index ? {IndexName: index} : {}),
    ...buildExpressionParams(filter, 'Filter', '', ' and '),
});
const mutateReadResult = r => ({
    items: r.Items,
    count: r.Count,
    scannedCount: r.ScannedCount,
    consumedCapacity: r.ConsumedCapacity,
    itemCollectionMetrics: r.ItemCollectionMetrics,
});
const mutateGetResult = r => {
    if (r && r.Item) return r.Item;
    throw new Error(`Unknown document`);
}
const mutateCreateResult = r => r.Item;
const mutateWriteResult = r => ({
    attributes: r.Attributes,
    consumedCapacity: r.ConsumedCapacity,
    itemCollectionMetrics: r.ItemCollectionMetrics,
});
export const dynamodb = {
    delete: async (table, key, returns: any = undefined) => mutateWriteResult(await awsdb.delete(buildParams(table, key, returns)).promise()),
    create: async (table, key, data, returns: any = undefined) => mutateCreateResult(await awsdb.put(buildCreateParams(table, key, data, returns)).promise()),
    upsert: async (table, key, data, returns: any = undefined) => mutateWriteResult(await awsdb.update(buildUpdateParams(table, key, data, returns)).promise()),
    queryIndex: async (table, index, key) => mutateReadResult(await awsdb.query(buildQueryParams(table, key, index)).promise()),
    get: async (table, key, returns: any = undefined) => mutateGetResult(await awsdb.get(buildGetParams(table, key, undefined, returns)).promise()),
    query: async (table, key) => mutateReadResult(await awsdb.query(buildQueryParams(table, key)).promise()),
    scanIndex: async (table, index, filter = {}) => mutateReadResult(await awsdb.scan(buildScanParams(table, filter, index)).promise()),
    scan: async (table, filter = {}) => mutateReadResult(await awsdb.scan(buildScanParams(table, filter)).promise()),
}

export default dynamodb
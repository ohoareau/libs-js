const db = new (require('aws-sdk/clients/docdb'));

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
const buildUpdateParams = (table, key, data, returns = undefined) => Object.entries(data).reduce((acc, [k, v], i) => {
    const kk = `#K${i}`;
    const vv = `:v${i}`;
    acc.ExpressionAttributeNames[kk] = k;
    acc.ExpressionAttributeValues[vv] = v;
    acc.UpdateExpression = `${acc.UpdateExpression || ''}${(acc.UpdateExpression ? ', ' : 'SET ')}${kk} = ${vv}`;
    return acc;
}, buildParams(table, key, returns, {ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, UpdateExpression: undefined}));

module.exports = {
    delete: async (table, key, returns = undefined) => db.delete(buildParams(table, key, returns)).promise(),
    upsert: async (table, key, data, returns = undefined) => db.update(buildUpdateParams(table, key, data, returns)).promise(),
};
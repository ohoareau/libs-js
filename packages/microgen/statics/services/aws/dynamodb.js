const db = new (require('aws-sdk/clients/docdb'));

const buildTableName = name => `${process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_PREFIX`] || process.env.DYNAMODB_TABLE_PREFIX || ''}${name}${process.env[`DYNAMODB_${name.toUpperCase()}_TABLE_SUFFIX`] || process.env.DYNAMODB_TABLE_SUFFIX || ''}`;

const buildParams = (table, key, extra = {}) => ({TableName: buildTableName(table), Key: key, ...extra});
const buildUpdateParams = (table, key, data) => Object.entries(data).reduce((acc, [k, v], i) => {
    const kk = `#K${i}`;
    const vv = `:v${i}`;
    acc.ExpressionAttributeNames[kk] = k;
    acc.ExpressionAttributeValues[vv] = v;
    acc.UpdateExpression = `${acc.UpdateExpression || ''}${(acc.UpdateExpression ? ', ' : 'SET ')}${kk} = ${vv}`;
    return acc;
}, {...buildParams(table, key, {ReturnValues: 'ALL_NEW'}), ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, UpdateExpression: undefined});

module.exports = {
    delete: async (table, key) => db.delete(buildParams(table, key)).promise(),
    upsert: async (table, key, data) => db.update(buildUpdateParams(table, key, data)).promise(),
};
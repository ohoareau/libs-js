jest.mock('aws-sdk/clients/docdb');

const docdbMock = require('aws-sdk/clients/docdb');
const dynamodb = require('../../../services/aws/dynamodb');

beforeAll(() => {
    jest.resetAllMocks();
});

describe('upsert', () => {
    it('prepare the underlying documentdb query', async () => {
        const mockUpdate = jest.fn();
        mockUpdate.mockReturnValue({promise: () => ({})});
        docdbMock.prototype.update = mockUpdate;
        expect(await dynamodb.upsert('mytable', {k1: 'v1'}, {a: 1, b: true, c: {d: ['e', 'f']}})).toBeDefined();
        expect(mockUpdate).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'a',
                '#K1': 'b',
                '#K2': 'c',
            },
            ExpressionAttributeValues: {
                ':v0': 1,
                ':v1': true,
                ':v2': {d: ['e', 'f']}
            },
            Key: {k1: 'v1'},
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
            ReturnValuesOnConditionCheckFailure: "NONE",
            TableName: 'mytable',
            UpdateExpression: 'SET #K0 = :v0, #K1 = :v1, #K2 = :v2',
        });
    });
    it('prepare the underlying documentdb query (return values)', async () => {
        const mockUpdate = jest.fn();
        mockUpdate.mockReturnValue({promise: () => ({})});
        docdbMock.prototype.update = mockUpdate;
        expect(await dynamodb.upsert('mytable', {k1: 'v1', k2: 12}, {abcde: true}, {values: 'ALL_NEW'})).toBeDefined();
        expect(mockUpdate).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'abcde',
            },
            ExpressionAttributeValues: {
                ':v0': true,
            },
            Key: {k1: 'v1', k2: 12},
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "ALL_NEW",
            ReturnValuesOnConditionCheckFailure: "NONE",
            TableName: 'mytable',
            UpdateExpression: 'SET #K0 = :v0',
        });
    });
});
describe('delete', () => {
    it('prepare the underlying documentdb query', async () => {
        const mockDelete = jest.fn();
        mockDelete.mockReturnValue({promise: () => ({})});
        docdbMock.prototype.delete = mockDelete;
        expect(await dynamodb.delete('mytable', {k1: 'v1'})).toBeDefined();
        expect(mockDelete).toHaveBeenCalledWith({
            Key: {k1: 'v1'},
            TableName: 'mytable',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
            ReturnValuesOnConditionCheckFailure: "NONE",
        });
    });
});
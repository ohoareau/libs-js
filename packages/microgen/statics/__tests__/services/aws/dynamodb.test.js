jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));

const docClientMock = require('aws-sdk/clients/dynamodb').DocumentClient;
const dynamodb = require('../../../services/aws/dynamodb');

beforeAll(() => {
    jest.resetAllMocks();
});

describe('upsert', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockUpdate = jest.fn();
        mockUpdate.mockReturnValue({promise: () => ({})});
        docClientMock.prototype.update = mockUpdate;
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
    it('prepare the underlying documentClient query (return values)', async () => {
        const mockUpdate = jest.fn();
        mockUpdate.mockReturnValue({promise: () => ({})});
        docClientMock.prototype.update = mockUpdate;
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
    it('prepare the underlying documentClient query', async () => {
        const mockDelete = jest.fn();
        mockDelete.mockReturnValue({promise: () => ({})});
        docClientMock.prototype.delete = mockDelete;
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

describe('queryIndex', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 2})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.queryIndex('mytable', 'myindex', {k1: 'v1'})).toEqual({
            items: [],
            count: 0,
            scannedCount: 2,
        });
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'k1',
            },
            ExpressionAttributeValues: {
                ':v0': 'v1',
            },
            TableName: 'mytable',
            IndexName: 'myindex',
            KeyConditionExpression: '#K0 = :v0',
        });
    });
    it('prepare the underlying documentClient query (no key)', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.queryIndex('mytable', 'myindex', {})).toEqual({
            items: [],
            count: 0,
            scannedCount: 1,
        });
        expect(mockQuery).toHaveBeenCalledWith({
            TableName: 'mytable',
            IndexName: 'myindex',
        });
    });
});
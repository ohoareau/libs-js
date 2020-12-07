jest.mock('aws-sdk/clients/dynamodb', () => ({DocumentClient: jest.fn()}));

const docClientMock = require('aws-sdk/clients/dynamodb').DocumentClient;
import dynamodb from '../../src/services/dynamodb';

beforeAll(() => {
    jest.resetAllMocks();
});

describe('upsert', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockUpdate = jest.fn();
        mockUpdate.mockReturnValue({promise: () => ({})});
        docClientMock.prototype.update = mockUpdate;
        expect(await dynamodb.upsert('mytable', {k1: 'v1'}, {a: 1, b: true, c: {d: ['e', 'f']}})).toEqual({
            attributes: undefined,
            consumedCapacity: undefined,
            itemCollectionMetrices: undefined,
        });
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
        mockUpdate.mockReturnValue({promise: () => ({
                Attributes: {abcde: true},
            })});
        docClientMock.prototype.update = mockUpdate;
        expect(await dynamodb.upsert('mytable', {k1: 'v1', k2: 12}, {abcde: true}, {values: 'ALL_NEW'})).toEqual({
            attributes: {abcde: true},
            consumedCapacity: undefined,
            itemCollectionMetrices: undefined,
        });
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
        expect(await dynamodb.delete('mytable', {k1: 'v1'})).toEqual({
            attributes: undefined,
            consumedCapacity: undefined,
            itemCollectionMetrices: undefined,
        });
        expect(mockDelete).toHaveBeenCalledWith({
            Key: {k1: 'v1'},
            TableName: 'mytable',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "NONE",
            ReturnValuesOnConditionCheckFailure: "NONE",
        });
    });
    it('prepare the underlying documentClient query (return values)', async () => {
        const mockDelete = jest.fn();
        mockDelete.mockReturnValue({promise: () => ({
            Attributes: {x: 12, y: 'hello'},
        })});
        docClientMock.prototype.delete = mockDelete;
        expect(await dynamodb.delete('mytable', {k1: 'v1'}, {values: 'ALL_OLD'})).toEqual({
            attributes: {x: 12, y: 'hello'},
            consumedCapacity: undefined,
            itemCollectionMetrices: undefined,
        });
        expect(mockDelete).toHaveBeenCalledWith({
            Key: {k1: 'v1'},
            TableName: 'mytable',
            ReturnConsumedCapacity: "NONE",
            ReturnItemCollectionMetrics: "NONE",
            ReturnValues: "ALL_OLD",
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
describe('query', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 2})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: 'v1'})).toEqual({
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
            KeyConditionExpression: '#K0 = :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator beginsWith', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: 'hello', k2: {type: 'beginsWith', value: 'xxx.'}})).toEqual({
            items: [],
            count: 0,
            scannedCount: 1,
        });
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'k1',
                '#K1': 'k2',
            },
            ExpressionAttributeValues: {
                ':v0': 'hello',
                ':v1': 'xxx.',
            },
            TableName: 'mytable',
            KeyConditionExpression: '#K0 = :v0 and begins_with(#K1, :v1)',
        });
    });
    it('prepare the underlying documentClient query with special operator eq', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'eq', value: 'abcd'}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0': 'abcd'},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 = :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator le', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'le', value: 'abcd'}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0': 'abcd'},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 <= :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator lt', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'lt', value: 'abcd'}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0': 'abcd'},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 < :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator ge', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'ge', value: 'abcd'}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0': 'abcd'},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 >= :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator gt', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'gt', value: 'abcd'}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0': 'abcd'},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 > :v0',
        });
    });
    it('prepare the underlying documentClient query with special operator between', async () => {
        const mockQuery = jest.fn();
        mockQuery.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 1})});
        docClientMock.prototype.query = mockQuery;
        expect(await dynamodb.query('mytable', {k1: {type: 'between', lowerBound: 1, upperBound: 10}})).toEqual({items: [], count: 0, scannedCount: 1});
        expect(mockQuery).toHaveBeenCalledWith({
            ExpressionAttributeNames: {'#K0': 'k1'},
            ExpressionAttributeValues: {':v0a': 1, ':v0b': 10},
            TableName: 'mytable',
            KeyConditionExpression: '#K0 BETWEEN :v0a AND :v0b',
        });
    });
});
describe('scan', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockScan = jest.fn();
        mockScan.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 2})});
        docClientMock.prototype.scan = mockScan;
        expect(await dynamodb.scan('mytable', {k1: 'v1'})).toEqual({
            items: [],
            count: 0,
            scannedCount: 2,
        });
        expect(mockScan).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'k1',
            },
            ExpressionAttributeValues: {
                ':v0': 'v1',
            },
            TableName: 'mytable',
            FilterExpression: '#K0 = :v0',
        });
    });
});
describe('scanIndex', () => {
    it('prepare the underlying documentClient query', async () => {
        const mockScan = jest.fn();
        mockScan.mockReturnValue({promise: () => ({Items: [], Count: 0, ScannedCount: 2})});
        docClientMock.prototype.scan = mockScan;
        expect(await dynamodb.scanIndex('mytable', 'myindex', {k1: 'v1'})).toEqual({
            items: [],
            count: 0,
            scannedCount: 2,
        });
        expect(mockScan).toHaveBeenCalledWith({
            ExpressionAttributeNames: {
                '#K0': 'k1',
            },
            ExpressionAttributeValues: {
                ':v0': 'v1',
            },
            TableName: 'mytable',
            IndexName: 'myindex',
            FilterExpression: '#K0 = :v0',
        });
    });
});
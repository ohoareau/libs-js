import IBackend from '../../IBackend';
import { CreateData, RemoveData, FindData, GetData, UpdateData } from './types';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import OperationNotSupportedBackendError from '../../errors/OperationNotSupportedBackendError';
import UnknownItemBackendError from '../../errors/UnknownItemBackendError';

export default class Backend implements IBackend {
    private adapter: DynamoDB.DocumentClient;
    private readonly table: string;
    private readonly name: string = 'dynamodb';
    constructor(dsn) {
        this.adapter = new DynamoDB.DocumentClient();
        this.table = dsn;
    }
    getName(): string {
        return this.name;
    }
    supports(operation: string): boolean {
        return 'function' === typeof this[`${operation}Operation`];
    }
    async execute(operation: string, data: object, options: object): Promise<any> {
        switch (operation) {
            case 'create':
                return this.createOperation(data as CreateData, options);
            case 'update':
                return this.updateOperation(data as UpdateData, options);
            case 'get':
                return this.getOperation(data as GetData, options);
            case 'find':
                return this.findOperation(data as FindData, options);
            case 'remove':
                return this.removeOperation(data as RemoveData, options);
            default:
                throw new OperationNotSupportedBackendError(this.getName(), operation);
        }
    }
    async createOperation({ data }: CreateData, options: object): Promise<any> {
        await this.adapter.put({
            TableName: this.table,
            Item: data,
            ReturnValues: 'NONE',
        }).promise();
        return {...data};
    }
    async updateOperation({ id, data }: UpdateData, options: object): Promise<any> {
        const result = await this.adapter.update({
            TableName: this.table,
            Key: {
                id,
            },
            ...this.prepareUpdatePropertiesFromData(data),
            ReturnValues: 'UPDATED_NEW',
        }).promise();
        if (!result || !result.Attributes) {
            throw new UnknownItemBackendError(this.getName(), this.table, id);
        }
        return {...result.Attributes, id};
    }
    async getOperation({ id, fields }: GetData, options: object): Promise<any> {
        const result = await this.adapter.get({
            TableName: this.table,
            Key: {
                id,
            },
            AttributesToGet: (fields && fields.length) ? fields : undefined,
        }).promise();
        if (!result || !result.Item) {
            throw new UnknownItemBackendError(this.getName(), this.table, id);
        }
        return result.Item;
    }
    async findOperation(query: FindData, options: object): Promise<any> {
        // const { criteria, fields, limit, sort, nextToken } = query;
        return {items: [{id: 'xxx'}], nextToken: 'next', query};
    }
    async removeOperation({ id }: RemoveData, options: object): Promise<any> {
        const result = await this.adapter.delete({
            TableName: this.table,
            Key: {
                id,
            },
            ReturnValues: 'ALL_OLD'
        }).promise();
        if (!result || !result.Attributes) {
            throw new UnknownItemBackendError(this.getName(), this.table, id);
        }
        return result.Attributes;
    }
    private prepareUpdatePropertiesFromData(data: object): object {
        const keys = Object.keys(data);
        if (!keys.length) {
            return {};
        }
        let i = 0;
        return keys.reduce((acc, k) => {
            i++;
            const ka = `#k${i}`;
            const va = `:v${i}`;
            acc.UpdateExpression = `${acc.UpdateExpression}${acc.UpdateExpression.length ? ',' : 'SET'} ${ka} = ${va}`;
            acc.ExpressionAttributeNames[ka] = k;
            acc.ExpressionAttributeValues[va] = data[k];
            return acc;
        }, {ExpressionAttributeNames: {}, ExpressionAttributeValues: {}, UpdateExpression: ''});
    }
}

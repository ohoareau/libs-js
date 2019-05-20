import IBackend from '../../IBackend';
import UnknownItemBackendError from '../../errors/UnknownItemBackendError';
import OperationNotSupportedBackendError from '../../errors/OperationNotSupportedBackendError';

const uuidv4 = require('uuid/v4');

export default class Backend implements IBackend {
    private data: object;
    private readonly name = 'memory';
    constructor() {
        this.data = {};
    }
    getName(): string {
        return this.name;
    }
    supports(operation: string): boolean {
        return 'function' === typeof this[`${operation}Operation`];
    }
    async execute(operation: string, data: object, options: object): Promise<any> {
        const m = this[`${operation}Operation`];
        if (!m) {
            throw new OperationNotSupportedBackendError(this.getName(), operation);
        }
        return this[m](data, options);
    }
    async createOperation({ data }: any, options: object): Promise<any> {
        return this.data[uuidv4()] = data;
    }
    async updateOperation({ id, data }: any, options: object): Promise<any> {
        await this.checkExistsOperation({ id }, options);
        return Object.assign(this.data[id], data);
    }
    async checkExistsOperation({ id }: any, options: object): Promise<void> {
        if (!this.data[id]) {
            throw new UnknownItemBackendError(this.getName(), 'items', id);
        }
    }
    async getOperation({ id, fields }: any, options: object): Promise<any> {
        await this.checkExistsOperation({ id }, options);
        return this.data[id];
    }
    async removeOperation({ id }: any, options: object): Promise<any> {
        await this.checkExistsOperation({ id }, options);
        delete this.data[id];
    }
}

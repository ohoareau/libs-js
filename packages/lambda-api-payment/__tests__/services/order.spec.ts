import service from '../../src/services/order';
import {PreconditionFailedError} from "@ohoareau/lambda-utils";

beforeEach(() => {
    jest.resetAllMocks();
})

describe('create', () => {
    it('for missing data throw an error', async () => {
        await expect(service.create({})).rejects.toThrow(new PreconditionFailedError({data: [{violation: 'missing'}]}));
    })
})
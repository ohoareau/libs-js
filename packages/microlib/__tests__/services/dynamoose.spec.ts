import dynamoose from '../../src/services/dynamoose';

describe('dynamoose', () => {
    it('getDb exists', async () => {
        expect('function' === typeof dynamoose.getDb).toBeTruthy();
    });
});
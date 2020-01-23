const dynamoose = require('../../services/dynamoose');

describe('dynamoose', () => {
    it('getDb exists', async () => {
        expect('function' === typeof dynamoose.getDb).toBeTruthy();
    });
});
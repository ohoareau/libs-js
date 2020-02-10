import event from '../../src/services/event';

describe('event', () => {
    it('consume exists', async () => {
        expect('function' === typeof event.consume).toBeTruthy();
    });
});
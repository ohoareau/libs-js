import handler from '..';

describe('handler', () => {
    it('executes the specified handler function and return result', async () => {
        expect(handler(() => 12)()).toEqual(12);
        expect(handler(({ x }) => x + 13)({x: 3})).toEqual(16);
    });
    it('throw the underlying error when error occured', async () => {
        await expect(handler(() => Promise.reject(new Error('Some error')))()).rejects.toThrow('Some error');
        await expect(handler(() => Promise.reject(new Error('Some other error')))()).rejects.toThrow('Some other error');
    });
    it('throw an error when handler is not a function', async () => {
        let error = {message: undefined};
        try {
            handler('this is not a function' as unknown as Function);
        } catch (e) {
            error = e;
        }
        expect(error.message).toEqual('Handler callback is not a function');
    });
    it('throw an error when handler throw an noerror and async is not enabled', async () => {
        let error = {message: undefined};
        try {
            handler(() => { throw new Error('some error')})();
        } catch (e) {
            error = e;
        }
        expect(error.message).toEqual('some error');
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - no message error', async () => {
        expect(await handler(() => { throw new Error()}, {async: true, noerror: true})()).toEqual({
            message: 'unexpected error',
            errorType: 'unexpected',
            data: undefined,
            errorInfo: undefined,
            key: 'unexpected',
            code: 500,
        });
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - basic error', async () => {
        expect(await handler(() => { throw new Error('some error')}, {async: true, noerror: true})()).toEqual({
            message: 'some error',
            errorType: 'unexpected',
            data: undefined,
            errorInfo: undefined,
            key: 'unexpected',
            code: 500,
        });
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - error with errorType', async () => {
        expect(await handler(() => { const e = new Error('some error 2'); (<any>e).errorType = 'zzz'; throw e; }, {async: true, noerror: true})()).toEqual({
            message: 'some error 2',
            errorType: 'zzz',
            data: undefined,
            errorInfo: undefined,
            key: 'unexpected',
            code: 500,
        });
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - error with data', async () => {
        expect(await handler(() => { const e = new Error('some error 3'); (<any>e).errorType = 'ttt'; (<any>e).data = {a: 'b'}; throw e; }, {async: true, noerror: true})()).toEqual({
            message: 'some error 3',
            errorType: 'ttt',
            data: {a: 'b'},
            errorInfo: {a: 'b'},
            key: 'unexpected',
            code: 500,
        });
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - error with errorInfo', async () => {
        expect(await handler(() => { const e = new Error('some error 4'); (<any>e).errorType = 'ttt'; (<any>e).data = {a: 'b'};  (<any>e).errorInfo = {x: 'y'}; throw e; }, {async: true, noerror: true})()).toEqual({
            message: 'some error 4',
            errorType: 'ttt',
            data: {a: 'b'},
            errorInfo: {x: 'y'},
            key: 'unexpected',
            code: 500,
        });
    });
    it('do not throw error and return normalized error result when handler throw an error and noerror is enabled - error with errorInfo but no async is indeed async', async () => {
        const r = handler(() => { const e = new Error('some error 4'); (<any>e).errorType = 'ttt'; (<any>e).data = {a: 'b'};  (<any>e).errorInfo = {x: 'y'}; throw e; }, {noerror: true})()
        expect(r).toBeInstanceOf(Promise);
        expect(await r).toEqual({
            message: 'some error 4',
            errorType: 'ttt',
            data: {a: 'b'},
            errorInfo: {x: 'y'},
            key: 'unexpected',
            code: 500,
        });
    });
    it('executes the specified handler with async function and return result', async () => {
        expect(await handler(() => 12, {async: true})()).toEqual(12);
        expect(await handler(({ x }) => x + 13, {async: true})({x: 3})).toEqual(16);
    });
    it('executes the specified handler with caller and return result', async () => {
        expect(await handler(({ caller }) => caller, {caller: () => ({authenticated: true})})({})).toEqual({authenticated: true});
    });
});
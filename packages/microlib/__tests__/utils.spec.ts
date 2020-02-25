const testMock = jest.fn();
jest.mock('../src/hooks/test', () => ({default: testMock}), {virtual: true});
import {initHook} from '../src/utils';

beforeEach(() => {
    jest.resetAllMocks();
});

describe('initHook', () => {
    it('return a function', () => {
        const hook = initHook('x_y_z', {}, __dirname);
        expect(hook).toEqual(expect.any(Function));
    });
    it('call specified hook type and return computed value', async () => {
        testMock.mockReturnValue(async () => 12);
        const hook = initHook('x_y_z', {}, __dirname);
        await expect(hook('@test', [])).resolves.toEqual(12);
    });
    it('call specified hook type in a loop with non object items (async) and return array of computed values', async () => {
        testMock.mockReturnValue(async () => 12);
        const hook = initHook('x_y_z', {}, __dirname);
        await expect(hook('@test', [{items: ['a', 'b', 'c']}], {x: '[[value]]'}, {loop: 'items'})).resolves.toEqual(12);
        expect(testMock).toHaveBeenNthCalledWith(1, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'a'});
        expect(testMock).toHaveBeenNthCalledWith(2, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'b'});
        expect(testMock).toHaveBeenNthCalledWith(3, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'c'});
    });
    it('call specified hook type in a loop with object items (async) and return array of computed values', async () => {
        testMock.mockImplementation(({x, y}) => async () => `x => ${x}, y => ${y}`);
        const hook = initHook('x_y_z', {}, __dirname);
        await expect(hook('@test', [{items: [{id: 'abc', name: 'a-b-c'}, {id: 'def', name: 'd-e-f'}, {id: 'ghi', name: 'g-h-i'}]}], {x: '[[id]]', y: '[[name]]'}, {loop: 'items'})).resolves.toEqual('x => ghi, y => g-h-i');
        expect(testMock).toHaveBeenNthCalledWith(1, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'abc', y: 'a-b-c'});
        expect(testMock).toHaveBeenNthCalledWith(2, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'def', y: 'd-e-f'});
        expect(testMock).toHaveBeenNthCalledWith(3, {o: 'x_y_z', model: {}, dir: expect.any(String), x: 'ghi', y: 'g-h-i'});
    });
    it('call specified hook type in a loop with object items (async) and return array of computed values (recursive replaced values)', async () => {
        testMock.mockReturnValue(async () => 13);
        const hook = initHook('x_y_z', {}, __dirname);
        await expect(hook('@test', [{items: [{id: 'abc', name: 'a-b-c'}, {id: 'def', name: 'd-e-f'}, {id: 'ghi', name: 'g-h-i'}]}], {x: {y: {t: '[[id]]'}}, z: 'hello'}, {loop: 'items'})).resolves.toEqual(13);
        expect(testMock).toHaveBeenNthCalledWith(1, {o: 'x_y_z', model: {}, dir: expect.any(String), x: {y: {t: 'abc'}}, z: 'hello'});
        expect(testMock).toHaveBeenNthCalledWith(2, {o: 'x_y_z', model: {}, dir: expect.any(String), x: {y: {t: 'def'}}, z: 'hello'});
        expect(testMock).toHaveBeenNthCalledWith(3, {o: 'x_y_z', model: {}, dir: expect.any(String), x: {y: {t: 'ghi'}}, z: 'hello'});
    });
});
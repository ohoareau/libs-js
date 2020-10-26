import {register} from '../src';

beforeEach(() => {
    jest.resetAllMocks();
})
describe('register', () => {
    it('register', async () => {
        const document = {
            getElementById: jest.fn(),
        };
        const window = {};
        const key = 'mykey';
        const globals = {
            React: {
                createElement: jest.fn(),
            },
            ReactDOM: {
                render: jest.fn(),
            },
        };
        const theNode = {dataset: {mykeyId: 'xyz'}};
        const configurationFetcher = async () => ({a: 1, b: true, c: 'hello'});
        let x = {executed: false};
        const loaderFactory = ({render}) => async (id, props) => {
            x.executed = true;
            await render(id, () => {}, props);
        };
        expect(window[key]).toBeUndefined();
        await register(document, window, key, globals, configurationFetcher, loaderFactory);
        expect(window[key]).toBeDefined();
        expect(window[key].getInfos()).toEqual({registrations: 1});
        document.getElementById.mockImplementationOnce(() => theNode);
        document.getElementById.mockImplementationOnce(() => theNode);
        globals.React.createElement.mockImplementationOnce(() => 1234);
        globals.React.createElement.mockImplementationOnce(() => 4567);
        await window[key].registerWidget('abcd', {});
        expect(x.executed).toBeTruthy();
        expect(globals.ReactDOM.render).toHaveBeenCalledWith(4567, theNode);
        expect(globals.React.createElement).toHaveBeenNthCalledWith(1, expect.any(Function), {
            config: {
                id: 'xyz',
                a: 1,
                b: true,
                c: 'hello',
            },
            elementId: 'abcd',
            id: 'xyz',
        });
        expect(globals.React.createElement).toHaveBeenNthCalledWith(2, expect.any(Function), null, 1234);
        expect(window[key].getWidgets()).toEqual({
            abcd: {
                config: {
                    id: 'xyz',
                    a: 1,
                    b: true,
                    c: 'hello',
                },
                key: 'xyz',
                status: 'rendered',
            },
        });
    });
});
import createManager from './createManager';
import {document, window, globals, manager} from '../types';

export const register = async (
    document: document, window: window, key: string, globals: globals,
    configurationFetcher: Function, loaderFactory: Function
) => {
    if (!window[key]) window[key] = createManager({
        document, window, globals,
        loaderFactory, configurationFetcher,
    });
    const manager = window[key] as manager;
    manager && manager.register && await manager.register()
}

export default register
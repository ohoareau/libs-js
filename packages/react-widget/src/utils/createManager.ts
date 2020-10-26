import getWidgetConfiguration from './getWidgetConfiguration';
import {manager, globals, document, window} from '../types';

export const createManager = (
    {document, window, globals, loaderFactory, configurationFetcher}:
    {document: document, window: window, globals: globals, loaderFactory: Function, configurationFetcher: Function}
    ) => {
    const manager = {} as manager
    const widgets = {};
    const infos = {registrations: 0};
    const getElementData = id => {
        const dataset = document.getElementById(id).dataset;
        const data = {};
        for (const k in dataset) {
            // noinspection JSUnfilteredForInLoop
            if ('maarsw' !== k.slice(0, 6)) continue;
            // noinspection JSUnfilteredForInLoop
            const kk = k.slice(6);
            // noinspection JSUnfilteredForInLoop
            data[`${kk.slice(0, 1).toLowerCase()}${kk.slice(1)}`] = dataset[k];
        }
        return data;
    };
    const getWidgets = () => widgets;

    const renderWidget = loaderFactory({
        document,
        window,
        ...globals,
        manager,
    });
    const registerWidget = async (id, ...args) => {
        widgets[id] = widgets[id] || {};
        widgets[id].status = 'created';
        const props = getElementData(id) as any;
        props['id'] = props['id'] || 'default';
        widgets[id].key = props['id'] || undefined;
        widgets[id].config = await getWidgetConfiguration(props, configurationFetcher);
        widgets[id].status = 'configured';
        await renderWidget(id, {...props, config: widgets[id].config}, ...args);
        widgets[id].status = 'rendered';
    };

    const register = async () => {
        infos.registrations++;
    };

    manager.getWidgets = getWidgets;
    manager.registerWidget = registerWidget;
    manager.register = register;

    return manager;
};

export default createManager
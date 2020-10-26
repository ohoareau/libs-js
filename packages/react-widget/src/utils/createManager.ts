import getWidgetConfiguration from './getWidgetConfiguration';
import {manager, globals, document, window} from '../types';
import render from "./render";

export const createManager = (
    {document, window, globals, key, loaderFactory, configurationFetcher}:
    {document: document, window: window, globals: globals, key: string, loaderFactory: Function, configurationFetcher: Function}
    ) => {
    const manager = {} as manager
    const widgets = {};
    const infos = {registrations: 0};
    const getElementData = id => {
        const dataset = document.getElementById(id).dataset;
        const data = {};
        for (const k in dataset) {
            // noinspection JSUnfilteredForInLoop
            if (key !== k.slice(0, key.length)) continue;
            // noinspection JSUnfilteredForInLoop
            const kk = k.slice(key.length);
            // noinspection JSUnfilteredForInLoop
            data[`${kk.slice(0, 1).toLowerCase()}${kk.slice(1)}`] = dataset[k];
        }
        return data;
    };
    const getWidgets = () => widgets;

    const renderWidget = loaderFactory({
        document,
        window,
        render: render({document, ...globals}),
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

    const getInfos = () => ({...infos});

    manager.getWidgets = getWidgets;
    manager.registerWidget = registerWidget;
    manager.register = register;
    manager.getInfos = getInfos;

    return manager;
};

export default createManager
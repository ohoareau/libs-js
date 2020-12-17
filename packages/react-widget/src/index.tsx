import React, {ComponentType, StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {createContext} from 'react';

export const Context = createContext({});
export const ContextProvider = Context.Provider;
export const ContextConsumer = Context.Consumer;

Context.displayName = 'Context';

export type configuration = {
    type: string,
    [key: string]: any,
};

export type manager = {
    getWidgets: () => {[key: string]: any},
    registerWidget: (id: string) => Promise<void>,
    register: () => Promise<void>,
    getInfos: {registrations: number},
};

export const register = async ({window, ...args} : managerArgs & {window: any}) => {
    if (!window[args.key]) window[args.key] = createManager(args);
    const manager = window[args.key] as manager;
    manager && manager.register && await manager.register()
}

type managerArgs = {
    document: {getElementById: (id: string) => any},
    key: string,
    configure: (id: string, context: {[key: string]: any}) => Promise<configuration>,
    component: ComponentType,
    context: {[key: string]: any},
};

const createManager = ({document, key, component: Component, configure, context}: managerArgs) => {
    const manager = {};
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
    const registerWidget = async (id) => {
        widgets[id] = widgets[id] || {};
        widgets[id].status = 'created';
        const props = getElementData(id) as any;
        const widgetContext = {...context};
        (Object.assign as any)(widgetContext, props);
        props['id'] = props['id'] || 'default';
        widgets[id].key = props['id'] || undefined;
        widgets[id].config = {id: props['id'], ...await configure(props['id'], widgetContext)};
        widgets[id].status = 'configured';
        ReactDOM.render(
            <StrictMode>
                <ContextProvider value={widgetContext}>
                    <Component {...props} config={widgets[id].config} elementId={id} context={widgetContext} />
                </ContextProvider>
            </StrictMode>,
            document.getElementById(id)
        );
        widgets[id].status = 'rendered';
    };

    const register = async () => {
        infos.registrations++;
    };

    const getInfos = () => ({...infos});

    manager['getWidgets'] = getWidgets;
    manager['registerWidget'] = registerWidget;
    manager['register'] = register;
    manager['getInfos'] = getInfos;

    return manager as manager;
};

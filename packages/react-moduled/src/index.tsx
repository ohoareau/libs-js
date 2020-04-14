import React, {lazy, Suspense} from 'react';
import cache from '@ohoareau/cache';
import {camelcase} from '@ohoareau/string';
import {DocumentNode} from 'graphql';

const plugins = {};

export const getPlugins = () => plugins;
export const register = (name, plugin, module = 'all') =>
    (plugins[module] = (plugins[module] || {}))[name] = ('function' === typeof plugin) ? plugin : () => plugin
;
export const call = (type: string, args: any[] = [], module: string = 'root', throwErrorIfNone = true) => {
    if ((module !== 'all') && plugins[module] && plugins[module][type]) return plugins[module][type](...args, {module});
    if (plugins['all'] && plugins['all'][type]) return plugins['all'][type](...args, {module});
    if (throwErrorIfNone) throw new Error(`No '${type}' plugin registered${('all' !== module) ? ` for module '${module}'` : ''}`);
}
export const importComponentFile = async (path: string, module: string = 'root') =>
    call('component', [path], module)
;
export const importFile = async (path: string, module: string = 'root') =>
    call('file', [path], module)
;
export const getDefinition = async (version: string, module: string = 'root') =>
    call('definition', [version], module)
;
export const getGraphQLQuery = (name: string, module: string = 'root'): DocumentNode =>
    call('graphql', [name], module)
;
export const getConfig = (defaultValue: {[key: string]: any} = {}, module: string = 'root'): {[key: string]: any} =>
    call('config', [], module) || defaultValue
;
export const getConfigSection = (name: string, defaultValue: {[key: string]: any} = {}, module: string = 'root'): {[key: string]: any} =>
    call('config', [name], module) || defaultValue
;

export const getComponent = ({module = 'root', path, name}, fallback) => {
    const key = `${module}-${path}-${name}`;
    let cached = cache.get('components', key);
    if (!cached) {
        const Component = lazy(() => importComponentFile(`${path}/${name}`, module));
        cached = cache.set('components', key, props => (
            <Suspense fallback={fallback}>
                <Component {...props} />
            </Suspense>
        ));
    }
    return cached;
};

export const getTypedComponent = ({def, type, path}, fallback: any = <div />) => {
    const tokens = def.type.split(/:/);
    const [module, name] = (1 < tokens.length)
        ? [tokens[0], camelcase(tokens.slice(1).join(':'), type)]
        : ['root', camelcase(def.type, type)]
    ;
    return getComponent({module, path, name}, fallback);
};

const load = async (name = 'root') => {
    const module = await getDefinition('1.0', name);
    return call('load', [module], name, false) || module;
};

const enrich = async module =>
    (await call('enrich', [module], module.name, false)) || module
;
export const getModule = async (name = 'root') =>
    cache.get('modules', name) || enrich(await cache.set('modules', name, await load(name)))
;

export const getModuleSync = name => cache.get('modules', name, {});
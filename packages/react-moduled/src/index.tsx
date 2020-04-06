import React, {lazy, Suspense} from 'react';
import cache from '@ohoareau/cache';
import {camelcase} from '@ohoareau/string';
import {DocumentNode} from 'graphql';

const plugins = {
    rootComponentFileImporter: undefined,
    moduleFileImporter: undefined,
    moduleVersionDefinitionGetter: undefined,
    moduleEnricher: undefined,
    modulePostLoader: undefined,
    graphQLQueryGetter: undefined,
    configSectionGetter: undefined,
};

export const registerPlugin = (name, plugin) => plugins[name] = plugin;

export const importRootComponentFile = async path => {
    if (!plugins.rootComponentFileImporter) throw new Error('No root component file importer registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.rootComponentFileImporter(path);
};
export const importModuleFile = async (module, path) => {
    if (!plugins.moduleFileImporter) throw new Error('No module file importer registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.moduleFileImporter(module, path);
};
export const getModuleVersionDefinition = async (name, version) => {
    if (!plugins.moduleVersionDefinitionGetter) throw new Error('No module version definition getter registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.moduleVersionDefinitionGetter(name, version);
};

export const getGraphQLQuery = (name: string): DocumentNode => {
    if (!plugins.graphQLQueryGetter) throw new Error('No GraphQL query getter registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.graphQLQueryGetter(name);
}

export const getConfigSection = (name: string, defaultValue: {[key: string]: any} = {}): {[key: string]: any} => {
    if (!plugins.configSectionGetter) throw new Error('No config section getter registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.configSectionGetter(name) || defaultValue;
}

const enrichModule = async module => {
    if (!plugins.moduleEnricher) throw new Error('No module enricher registered');
    // noinspection JSValidateTypes
    // @ts-ignore
    return plugins.moduleEnricher(module);
};
export const getModuleComponent = ({module, path, name}, fallback) => {
    const key = `${module}-${path}-${name}`;
    let cached = cache.get('components', key);
    if (!cached) {
        const Component = lazy(() => {
            if (module === 'root') return importRootComponentFile(`${path}/${name}.jsx`);
            return importModuleFile(module, `components/${path}/${name}.jsx`);
        });
        cached = cache.set('components', key, props => (
            <Suspense fallback={fallback}>
                <Component {...props} />
            </Suspense>
        ));
    }
    return cached;
};

export const getTypedModuleComponent = ({def, type, path}, fallback: any = <div />) => {
    const tokens = def.type.split(/:/);
    const [module, name] = (1 < tokens.length)
        ? [tokens[0], camelcase(tokens.slice(1).join(':'), type)]
        : ['root', camelcase(def.type, type)]
    ;
    return getModuleComponent({module, path, name}, fallback);
};

const loadModule = async name => {
    const module = await getModuleVersionDefinition(name, '1.0');
    // @ts-ignore
    // noinspection JSValidateTypes
    return plugins.modulePostLoader ? plugins.modulePostLoader(module) : module;
};
export const getModule = async (name = 'root') =>
    cache.get('modules', name) || enrichModule(await cache.set('modules', name, await loadModule(name)))
;

export const getModuleSync = name => cache.get('modules', name, {models: {}, rules: {}});
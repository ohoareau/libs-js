import React from 'react';
import clone from '@ohoareau/clone';
import * as icons from '@material-ui/icons';
import {camelcase} from '@ohoareau/string';
import {generateValues} from '@ohoareau/generate';
import {getModule, getModuleSync} from '@ohoareau/react-moduled';
import {pathize, cloneScope, buildSubScopeTree} from '@ohoareau/scope';

export const onScopeAction = async (ctx, action, data = {}, extraData = {}) => {
    const {scope} = ctx;
    const rules = (await getModule(scope.module)).rules || {};
    const key = `on_${action}_${scope.name}`;
    if (rules[key]) {
        const r = await rules[key]({...ctx, action, data, extraData});
        if (r) data = r;
    }
    return {...ctx, data, ...extraData, action};
};

export const buildDefinition = async moduleNames =>
    pathize(cloneScope(buildSubScopeTree(await Promise.all(moduleNames.map(async m => ({
        module: m,
        scopes: (await getModule(m)).scopes || [],
    }))))))
;

export const getScopeDefaults = ctx => ({
    ...generateValues((getModuleSync(ctx.scope.module).models[ctx.scope.name] || {}).defaults || {}, ctx),
});

export const getScopeIconComponent = scope => props => {
    const Component = icons[camelcase(scope.icon)] || (() => null);
    return (
        <Component {...props} />
    );
};

export const enrichScope = async s => {
    s.subScopes = s.subScopes || [];
    s.features = s.features || {};
    if (s.features['addSubScopesFromScopeTemplates']) {
        await s.features['addSubScopesFromScopeTemplates'].reduce(async (acc, d) => {
            const [module, name] = d.split(/:/);
            s.subScopes.push(await enrichScope(clone(await (await ((await getModule(module))['scopeTemplates'] || {}))[name])));
            return Promise.resolve();
        }, Promise.resolve());
    }
    return s;
};


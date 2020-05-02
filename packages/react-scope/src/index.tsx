import React from 'react';
import clone from '@ohoareau/clone';
import * as rules from './rules';
import * as icons from '@material-ui/icons';
import {camelcase} from '@ohoareau/string';
import {generateValues} from '@ohoareau/generate';
import {getModule, getModuleSync} from '@ohoareau/react-moduled';
import {pathize, cloneScope, buildSubScopeTree} from '@ohoareau/scope';

export const mutateRule = def =>
    !def ? rules.noop() : (('function' === typeof def) ? def : (rules[def.type] || rules.noop)(def))
;

export const applyRules = (rules, x) => rules.reduce((data, r) => mutateRule(r)(x) || data, x.data);

export const onScopeAction = async (ctx, action, data = {}, extraData = {}) => {
    const rootRuleFn = ((await getModule(ctx.scope.module)).rules || {})[`on_${action}_${ctx.scope.name}`] || undefined;
    const modelRules = ((((await getModule(ctx.scope.module)).models || {})[ctx.scope.name] || {}).rules || {})[action] || [];
    return ({
        ...ctx,
        data: applyRules(
            [...(rootRuleFn ? [rootRuleFn] : []), ...modelRules],
            {...ctx, action, data, extraData}
        ),
        ...extraData,
        action,
    });
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
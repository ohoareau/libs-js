import {titlize} from '@ohoareau/string';
import {prioritySorter} from '@ohoareau/sorter';

export const hasScopeFeature = (ctx, feature, defaultValue = false) => {
    const {scope} = ctx;
    if (!scope.features || !scope.features.hasOwnProperty(feature)) return defaultValue;
    return !!scope.features[feature];
};

export const buildParentScopes = (parentScopesNames, scopes) => {
    return parentScopesNames.reduce((acc, p) => {
        acc.next = acc.next.subScopes.find(s => s.name === p);
        acc.items.push(acc.next);
        return acc;
    }, {next: {subScopes: scopes}, items: []}).items;
};

export const groupScopes = subScopes =>
    Object.entries(subScopes.reduce((acc, s) => {
        const g = s.group || 'primary';
        acc[g] = (acc[g] || []);
        acc[g].push(s);
        return acc;
    }, {})).reduce((acc, [k, v]) => {
        (<{priority: number}[]>v).sort((a, b) => a.priority >= b.priority ? -1 : 1);
        acc[k] = v;
        return acc;
    }, {})
;

export const buildParentCheckMessages = (def, {scope, item}) => {
    const messages = <any[]>[];
    if (def.type === 'itemCount') {
        const l = item[`${scope.name}s`];
        const n = (l && l.length) || 0;
        if (def.hasOwnProperty('min') && (n < def.min)) messages.push({message: def.label, severity: def.severity || 'info'});
        if (def.hasOwnProperty('max') && (n > def.max)) messages.push({message: def.label, severity: def.severity || 'info'});
    }
    return messages;
};

export const computeScopeMessages = ({scope, item, context, subScopes}) => {
    return subScopes.reduce((acc, ss) => {
        if (!ss['parentMessages'] || !ss['parentMessages'].length) return acc;
        return ss['parentMessages'].reduce((acc2, c) => {
            const ms = buildParentCheckMessages(c, {scope: ss, item});
            if (!ms || !ms.length) return acc2;
            return acc2.concat(ms);
        }, acc);
    }, []);
};

const objectContains = (a, b) => {
    return !Object.entries(b).find(([k, v]) => a[k] !== v);
};

export const testShortcutCondition = (condition, {item, scope}) => {
    if ('noSubScopeItem' === condition.type) {
        const items = item[`${scope.name}s`] || [];
        return (!items.length || !items.find(ii => objectContains(ii, condition['matching'] || {})));
    }
    return false;
};

export const formatScope = ({scope}, item, format) => titlize(((scope['formatters'] || {})[format] || {}), item);

export const cloneScope = v => ({...v, subScopes: (v.subScopes || []).map(cloneScope)});

export const buildSubScopeTreeBranch = (module, subScopes, namedScopes, attachToParent: string|undefined = undefined) => {
    (subScopes || []).forEach(scope => {
        scope = {...scope};
        scope.subScopes = [...(scope.subScopes || [])];
        buildSubScopeTreeBranch(scope.module || module, scope.subScopes, namedScopes);
        if (namedScopes[`${module}:${scope.name}`] && namedScopes[`${module}:${scope.name}`].subScopes) {
            scope.subScopes = [...namedScopes[`${module}:${scope.name}`].subScopes, ...scope.subScopes];
        }
        namedScopes[`${module}:${scope.name}`] = scope;
        let localAttachToParents = scope.parent || attachToParent;
        if (localAttachToParents) {
            if (!Array.isArray(localAttachToParents)) localAttachToParents = [localAttachToParents];
            localAttachToParents.forEach(localAttachToParent => {
                if (!namedScopes[localAttachToParent]) namedScopes[localAttachToParent] = {};
                if (!namedScopes[localAttachToParent].subScopes) namedScopes[localAttachToParent].subScopes = [];
                namedScopes[localAttachToParent].subScopes.push(scope);
            });
        }
    });
    return namedScopes;
};

export const buildSubScopeTree = moduleScopes => {
    const scopes = moduleScopes.reduce((acc, {module, scopes}) => buildSubScopeTreeBranch(module, scopes, acc, 'root'), {root: {}});
    Object.values(scopes).forEach(v => {
        if ((<any>v).subScopes) (<any>v).subScopes.sort(prioritySorter);
    });
    return scopes.root;
};

export const pathize = (x, parentPath?: any) => {
    x.subScopes.forEach(s => {
        s.path = (parentPath ? parentPath : []).concat(s.name);
        s.subScopes && pathize(s, s.path);
    });
    return x;
};

export const scopeAssign = (x, d) => {
    Object.entries(x).forEach(([k, v]) => {
        if (!Array.isArray(v)) return;
        if (!/s$/.test(k)) return;
        v.forEach(vv => scopeAssign(vv, d));
    });
    Object.assign(x, d);
    return x;
};
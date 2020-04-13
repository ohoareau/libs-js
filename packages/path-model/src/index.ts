import arrayMove from 'array-move';

export const add = ({model, path, context, data}) => {
    const parent = get({model, path, context});
    parent.push(data);
    return data;
};
export const get = ({model, path, context}) => {
    const last = [...path].pop();
    const previouses = path.slice(0, -1);
    const x = previouses.reduce((acc, p) => {
        if (!acc[`${p}s`]) acc[`${p}s`] = [];
        return acc[`${p}s`].find(ii => ii.id === context[`${p}Id`]);
    }, model);
    if (!x[`${last}s`]) x[`${last}s`] = [];
    return x[`${last}s`];
};
export const getParentAndMetas = ({model, path, context}) => {
    const last = [...path].pop();
    const previouses = path.slice(0, -1);
    const lastPrevious = [...previouses].pop();
    let parent;
    if (!lastPrevious) {
        parent = model;
    } else {
        parent = get({model, path: previouses, context}).find(ii => ii.id === context[`${lastPrevious}Id`]);
    }
    return {parent, last, previouses};
};
export const move = ({model, path, context, data}) => {
    const {parent, last} = getParentAndMetas({model, path, context});
    parent[`${last}s`] = arrayMove(parent[`${last}s`], data.oldIndex, data.newIndex);
    return parent[`${last}s`][data.newIndex];
};
export const remove = ({model, path, context, id}) => {
    const {parent, last} = getParentAndMetas({model, path, context});
    const old = parent[`${last}s`];
    parent[`${last}s`] = old.filter(ii => ii.id !== id);
    return parent;
};
export const replace = ({model, path, context, id, data}) => {
    const {parent, last} = getParentAndMetas({model, path, context});
    return parent[`${last}s`][parent[`${last}s`].findIndex(ii => ii.id === id)] = data;
};
export const update = ({model, path, context, id, data, recursion = undefined}) => {
    const {parent, last} = getParentAndMetas({model, path, context});
    const old = parent[`${last}s`].find(ii => ii.id === id);
    const item = parent[`${last}s`][parent[`${last}s`].findIndex(ii => ii.id === id)] = {...old, ...data};
    (recursion === 'up') && parentsUpdate({data, path, context, model});
    (recursion === 'down') && childrenUpdate({item, data});
    return item;
};

const childrenUpdate = ({item, data}) => {
    Object.entries(item).forEach(([k, v]) => {
        if (/s$/.test(k) && Array.isArray(v)) {
            v.forEach(vv => childrenUpdate({item: vv, data}));
        }
    });
    Object.assign(item, data);
    return item;
};
const parentsUpdate = ({data, path, context, model}) => {
    const {parent, previouses} = getParentAndMetas({model, path, context});
    if (!previouses.length) return undefined;
    Object.assign(parent, data);
    return parentsUpdate({data, path: previouses, context, model});
};

export const buildPath = ({path, context}) =>
    path.reduce((acc, p) => `${acc || ''}${acc ? '.' : ''}${p}s${context[`${p}Id`] ? '.' : ''}${context[`${p}Id`] || ''}`, '')
;

export const getModelPath = ({path, model}) => {
    const tokens = path.split(/\./g);
    let i = 0;
    const n = tokens.length;
    let kk;
    const context = {};
    const parents = <any[]>[];
    while (model && (i < n)) {
        parents.push(model);
        model = (model[tokens[i]] || []).find(item => item.id === tokens[i + 1]);
        if (model) {
            kk = tokens[i].replace(/s$/, '');
            context[`${kk}Id`] = tokens[i + 1];
            context[kk] = model;
        }
        i = i + 2;
    }
    parents.shift();
    return {model, parents, context};
};

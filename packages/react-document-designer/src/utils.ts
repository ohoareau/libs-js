import jexl from 'jexl';
jexl.addTransform('length', v => (v && v.length) || 0);

export const selectionFilter = (x: any) => '_' !== x.slice(0, 1);

export const getSelectionTypeNames = items => (Object.keys(items) as any[]).filter(selectionFilter);

export const applyStylesheetExtends = (s, stylesheets) => {
    if (!s.extends) return {...s};
    return applyStylesheetExtends({
        ...(stylesheets[s.extends] || {}),
        ...s,
        variables: {
            ...((stylesheets[s.extends] || {}).variables || {}),
            ...(s.variables || {}),
        },
        types: {
            ...((stylesheets[s.extends] || {}).types || {}),
            ...(s.types || {}),
        },
        extends: (stylesheets[s.extends] || {}).extends,
    }, stylesheets);
};

export const buildStylesheet = (name, stylesheets) => {
    if (!name) return undefined;
    const s = applyStylesheetExtends(stylesheets[name], stylesheets);
    delete s.extends;
    return s;
};

export const applyCondition = (c, data) => !!jexl.evalSync(c, data);

export const applyConditions = (c, data) =>
    (Array.isArray(c) ? c : [c]).reduce((acc, cc) => acc ? applyCondition(cc, data) : false, true)
;

export const isValidFragment = (f, config, model) =>
    !(!f || (f.condition && !applyConditions(f.condition, {definition: f, ...(config[f.id] || {}), ...model})))
;

export const prepareFragments = (template, config, model) =>
    ((template || {}).fragments || []).filter(f => isValidFragment(f, config, model))
;

export const prepareSuggestions = (template) =>
    (template.suggestions || []).reduce((acc, s) => {
        acc.ids[s.id] = s;
        if (s.tags) s.tags.forEach(t => (acc.tags[t] = acc.tags[t] || []).push(s));
        return acc
    }, {ids: {}, tags: {}})
;

export const prepareDoc = ({fragments, current, config, model, selection, suggestions}) => ({
    fragments: [{...(fragments[fragments.findIndex(f => f.id === current)] || {})}],
    config,
    model,
    stylesheet: computeStylesheet(selection),
    suggestions,
});

export const computeStylesheet = ({theme, format, fontset, fontsize}) => {
    const s = {fonts: [], variables: {}, types: {}, ...format};
    theme.variables && (s.variables = {...s.variables, ...theme.variables});
    fontset.variables && (s.variables = {...s.variables, ...fontset.variables});
    fontset.fonts && (s.fonts = [...s.fonts, ...fontset.fonts]);
    fontsize.variables && (s.variables = {...s.variables, ...fontsize.variables});
    return s;
};

const myFilter = (x: any) => '_' !== x.id.slice(0, 1);

export const prepareSelectorItems = items => {
    items = (Object.values(items) as any[]).filter(myFilter);
    items.sort((a, b) => a.priority > b.priority ? -1 : (a.priority < b.priority ? 1 : 0));
    return items;
};


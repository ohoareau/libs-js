export const buildTemplatedDocumentFragmentList = (template, data, model) => {
    return template.fragments || [];
};

export const buildTemplatedDocumentFragment = (template, data, model, id) => {
    return {...((template.fragments || []).find(f => f.id === id) || {})};
};
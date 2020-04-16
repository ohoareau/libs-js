const parseContentItemGeneric = ({contentType, ...data}) => ({type: contentType, ...data});
const parseContentItemField = (data, def, model) => {
    const field = {requires: [], default: undefined, ...(model.attributes || {})[data.name], ...data, prefix: model.prefix};
    !field.type && (field.type = field.name);
    if (undefined !== field.default) {
        !def.defaults && (def.defaults = {});
        def.defaults[field.name] = field.default;
    }
    !def.namedFields && (def.namedFields = {});
    field.typepos = Object.keys(def.namedFields).length;
    def.namedFields[field.name] = field;
    return field;
};
const parseContentItem = (info, def, model) => {
    if (!info) info = {contentType: 'empty'};
    if ('string' === typeof info) info = {name: info};
    info = {contentType: 'field', ...info};
    switch (info.contentType) {
        case 'field': return parseContentItemField(info, def, model);
        case 'empty': return info;
        default: return parseContentItemGeneric(info);
    }
};
const parseContentColumn = (column, def, model) => {
    if (Array.isArray(column)) return column.reduce((acc, c) => {
        acc.push(parseContentColumn(c, def, model));
        return acc;
    }, []);
    return parseContentItem(column, def, model);
};
const parseContentRow = (row, def, model) => row.reduce((acc, c) => {
    acc.push(parseContentColumn(c, def, model));
    return acc;
}, []);
const parseContents = (contents, def, model) => (contents || []).reduce((acc, r) => {
    acc.push(parseContentRow(r ? (Array.isArray(r) ? r : [r]) : [], def, model));
    return acc;
}, []);
const describe = (model, definition = {}) => {
    // definition is updated potentially deeply in the following call, so do it first before return
    const contents = parseContents(definition['contents'] || [], definition, model);
    return {...definition, contents};
};
export default describe
const mapper = {
    'number>integer': v => v,
    'number>big_integer': v => v,
    'number>string': v => `${v}`,
    'string>string': v => v,
    'string>datetime': v => Date.parse(v),
    '*': v => `${v}`,
};

export function convertValue(raw, def) {
    return (mapper[`${raw['type']}>${def['type']}`] || mapper['*'])(raw['value']);
}

export default convertValue
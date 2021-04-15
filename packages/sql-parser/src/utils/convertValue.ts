const mapper = {
    'number>integer': v => v,
    'number>big_integer': v => v,
    'number>string': v => `${v}`,
    'string>string': v => v,
    'string>datetime': v => Date.parse(v),
    '*': v => `${v}`,
};

export function convertValue(raw, def) {
    const x = (mapper[`${raw['type']}>${def['type']}`] || mapper['*'])(raw['value']);
    return (def && def.format) ? def.format(x) : x;
}

export default convertValue
export const applyCondition = (def, ctx) => {
    switch (def.type) {
        case 'attribute-comparison':
            const value = ctx.item[def.name];
            switch (def.operator) {
                case 'eq': return value === def.value;
                case 'in': return !!def.values.find(ii => ii === value);
                case 'gt': return value > def.value;
                case 'ge': return value >= def.value;
                case 'lt': return value < def.value;
                case 'le': return value <= def.value;
                case 'ne': return value !== def.value;
                default: return false;
            }
        default:
            return false;
    }
};
export const applyConditions = (def, ctx) =>
    ((def || {})['conditions'] || []).reduce((acc, c) => acc && applyCondition(c, ctx), true)
;

export default applyConditions
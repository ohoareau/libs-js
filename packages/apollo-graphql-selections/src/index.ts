export function select(info: any) {
    if (!info) return {};
    return subSelect((info?.fieldNodes || [])[0]?.selectionSet?.selections || []);
}

function formatArgumentValue(val: { kind: string, value: any, block: boolean, values?: any, fields?: any }) {
    switch (val.kind) {
        case 'StringValue': return String(val.value);
        case 'IntValue': return parseInt(val.value);
        case 'ListValue': return val.values?.map(formatArgumentValue) || [];
        case 'ObjectValue': return val.fields?.reduce((acc, f) => Object.assign(acc, {[f.name.value]: formatArgumentValue(f)}), {}) || {};
        case 'ObjectField': return formatArgumentValue(val.value);
        default: return String(val.value);
    }
}
export function subSelect(selections: any[]) {
    return selections.filter(x => x.kind === 'Field').reduce((acc, selection) => {
        acc.fields.push(selection.name.value);
        if (selection.selectionSet?.selections?.length) {
            acc.selections[selection.name.value] = subSelect(selection.selectionSet?.selections || []);
        }
        if (selection.arguments?.length) {
            if (!acc.arguments) acc.arguments = {};
            acc.arguments[selection.name.value] = selection.arguments.reduce((acc, arg) => {
                acc[arg.name.value] = formatArgumentValue(arg.value);
                return acc;
            }, {} as any);
        }
        return acc;
    }, {fields: [], selections: {}});
}
export default select;
export function select(info: any) {
    if (!info) return {};
    return subSelect((info?.fieldNodes || [])[0]?.selectionSet?.selections || []);
}

function formatArgumentValue(val: { kind: string, value: any, block: boolean }) {
    switch (val.kind) {
        case 'StringValue': return String(val.value);
        case 'IntValue': return parseInt(val.value);
        default: return String(val.value);
    }
}
export function subSelect(selections: any[]) {
    return selections.filter(x => x.kind === 'Field').reduce((acc, selection) => {
        const na = selection?.alias?.value || selection.name.value;
        acc.fields.push(na);
        if (selection.selectionSet?.selections?.length) {
            acc.selections[na] = subSelect(selection.selectionSet?.selections || []);
        }
        if (selection.arguments?.length) {
            if (!acc.arguments) acc.arguments = {};
            acc.arguments[na] = selection.arguments.reduce((acc, arg) => {
                acc[arg.name.value] = formatArgumentValue(arg.value);
                return acc;
            }, {} as any);
        }
        return acc;
    }, {fields: [], selections: {}});
}
export default select;
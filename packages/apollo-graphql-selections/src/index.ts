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
        const alias = selection?.alias?.value;
        const na = alias || selection.name.value;
        if (alias) {
            acc.selections[selection.name.value] = acc.selections[selection.name.value] || {};
            acc.selections[selection.name.value].aliases = acc.selections[selection.name.value].aliases || [];
            acc.selections[selection.name.value].aliases.push(selection?.alias?.value)
        }
        acc.fields.push(na);
        if (selection.selectionSet?.selections?.length) {
            const old = acc.selections[na] || {};
            const ss = subSelect(selection.selectionSet?.selections || []);
            acc.selections[na] = {...old, ...ss, ...(old.aliases ? {aliases: [...old.aliases, ...(ss.aliases ? ss.aliases : [])]} : {}), ...(alias ? {aliasing: selection.name.value} : {})};
        } else {
            if (alias) {
                const old = acc.selections[na] || {};
                acc.selections[na] = {...old, aliasing: selection.name.value};
            }
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
export function select(info: any) {
    if (!info) return {};
    return subSelect((info?.fieldNodes || [])[0]?.selectionSet?.selections || []);
}

export function subSelect(selections: any[]) {
    return selections.filter(x => x.kind === 'Field').reduce((acc, selection) => {
        acc.fields.push(selection.name.value);
        if (selection.selectionSet?.selections?.length) {
            acc.selections[selection.name.value] = subSelect(selection.selectionSet?.selections || []);
        }
        return acc;
    }, {fields: [], selections: {}});
}
export default select;
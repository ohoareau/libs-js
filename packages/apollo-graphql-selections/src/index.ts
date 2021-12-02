/*
function selection(info) {
    if (!info) return [];
    if ('Page' === `${info.returnType}`.slice(-4)) {
        return (((((((((info.operation || {}).selectionSet || {}).selections || [])[0] || {}).selectionSet || {}).selections || [])[0] || {}).selectionSet || {}).selections || []).filter(x => x.kind === 'Field' && ('__typename' !== (x.name || {}).value)).map(s => s.name.value);
    }
    return info.operation.selectionSet.selections[0].selectionSet.selections.filter(x => x.kind === 'Field').map(s => s.name.value);
}
 */

export function select(info: any) {
    if (!info) return {};
    return subSelect(info.operation.selectionSet.selections[0].selectionSet.selections);
}

export function subSelect(selections: any[]) {
    return selections.filter(x => x.kind === 'Field').reduce((acc, selection) => {
        acc.fields.push(selection.name.value);
        if (selection.selectionSet?.selections) {
            acc.selections[selection.name.value] = subSelect(selection.selectionSet?.selections);
        }
        return acc;
    }, {fields: [], selections: {}})
}
export default select;
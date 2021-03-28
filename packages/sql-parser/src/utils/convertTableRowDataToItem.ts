import convertAttributeValue from "./convertAttributeValue";

export function convertTableRowDataToItem(model, table, data) {
    const tableModel = model['tables'][table];
    if (!tableModel) throw new Error(`Unknown table '${table}'`);

    const item = {};

    tableModel['attributeList'].reduce((acc, a,i) => {
        if (!tableModel['attributes'][a]) return acc;
        acc[a] = convertAttributeValue(data, tableModel['attributes'][a], i);
        return acc;
    }, item);

    return item;
}

export default convertTableRowDataToItem
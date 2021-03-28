import convertTableColumnToAttribute from "./convertTableColumnToAttribute";

export function convertTableDataToItem(model, data, t: any) {
    const item = {
        name: data['table'][0]['table'],
        attributes: {},
        attributeList: [],
    };
    (data['create_definitions'] || []).reduce((acc, c) => {
        switch (c['resource']) {
            case 'column':
                if (!t || !t.fields || !!t.fields.includes(c['column']['column'])) {
                    acc.attributes[c['column']['column']] = convertTableColumnToAttribute(c);
                }
                acc.attributeList.push(c['column']['column']);
                break;
        }
        return acc;
    }, item);
    return item;
}

export default convertTableDataToItem
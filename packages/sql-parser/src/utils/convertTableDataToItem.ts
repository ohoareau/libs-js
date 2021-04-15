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
                const d = (!t || !t.fields) ? {} : describeColumn(t.fields, c['column']['column']);
                if (d) {
                    acc.attributes[c['column']['column']] = {...d, ...convertTableColumnToAttribute(c)};
                }
                acc.attributeList.push(c['column']['column']);
                break;
        }
        return acc;
    }, item);
    return item;
}

function describeColumn(cols, c) {
    let x = cols.find(col => {
        if ('string' === typeof col) return col === c;
        return col.name === c;
    });
    if ('string' === typeof x) {
        x = {name: x};
    }
    return x;
}

export default convertTableDataToItem
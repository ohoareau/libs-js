import convertValue from "./convertValue";

export function convertAttributeValue(row, def, i: number) {
    return convertValue(row['values'][0]['value'][i], def);
}

export default convertAttributeValue
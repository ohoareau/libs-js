import convertType from "./convertType";

export function convertTableColumnToAttribute(data) {
    return {name: data['column']['column'], type: convertType(data['definition'])};
}

export default convertTableColumnToAttribute
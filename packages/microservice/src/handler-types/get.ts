import {Service, TypeConfig} from "../types";

export default (_, typeConfig: TypeConfig) => (event: any, context: any) => {
    const { params: { id, fields } = {id: undefined, fields: []}} = event;
    return (<Service>typeConfig.service).get(id, fields);
}
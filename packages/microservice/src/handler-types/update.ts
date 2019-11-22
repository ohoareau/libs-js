import {Service, TypeConfig} from "../types";

export default (_, typeConfig: TypeConfig) => (event: any, context: any) => {
    const { params: { id, input } = {id: undefined, input: {}}} = event;
    return (<Service>typeConfig.service).update(id, input);
}
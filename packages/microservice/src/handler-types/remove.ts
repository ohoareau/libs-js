import {Service, TypeConfig} from "../types";

export default (_, typeConfig: TypeConfig) => (event: any, context: any) => {
    const { params: { id } = {id: undefined}} = event;
    return (<Service>typeConfig.service).delete(id);
}
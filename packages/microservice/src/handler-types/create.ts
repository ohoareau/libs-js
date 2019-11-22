import {Service, TypeConfig} from "../types";

export default (_, typeConfig: TypeConfig) => (event: any, context: any) => {
    const { params: { input } = {input: {}}} = event;
    return (<Service>typeConfig.service).create(input);
}
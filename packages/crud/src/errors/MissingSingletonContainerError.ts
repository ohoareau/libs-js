import ContainerError from "./ContainerError";

export default class MissingSingletonContainerError extends ContainerError {
    constructor(id: string, data: object = {}) {
        super('singleton.missing', `Missing singleton '${id}'`, {...data, id });
    }
}

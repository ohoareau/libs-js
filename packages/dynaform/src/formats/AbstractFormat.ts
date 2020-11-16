import IFormat from "../IFormat";

export abstract class AbstractFormat implements IFormat {

    protected constructor() {
    }

    validate(def: any): void {
    }

}

export default AbstractFormat
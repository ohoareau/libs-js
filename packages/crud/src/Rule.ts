import Context from './Context';

export type JsonRule = {
    name: string,
    title: string,
    conditional: boolean,
    operations: string[],
    types: string[],
    executable: boolean,
};

export default class Rule {
    private readonly name: string;
    private readonly title: string;
    private readonly handler: Function;
    private readonly operations: {[k: string]: boolean};
    private readonly types: {[k: string]: boolean};
    private readonly condition?: ((ctx: Context, execCtx: Context) => boolean)|undefined;
    constructor(name, title, operations: string[], types: string[], handler: Function, condition: ((ctx: Context, execCtx: Context) => boolean)|undefined = undefined) {
        this.name = name;
        this.title = title;
        this.handler = handler;
        this.operations = operations.reduce((acc, o) => {
            acc[o] = true;
            return acc;
        }, {});
        this.types = types.reduce((acc, o) => {
            acc[o] = true;
            return acc;
        }, {});
        this.condition = condition;
    }
    toJson(): JsonRule {
        return <JsonRule>{
            name: this.getName(),
            title: this.getTitle(),
            conditional: this.hasCondition(),
            operations: Object.keys(this.getOperations()),
            types: Object.keys(this.getTypes()),
            executable: this.hasHandler(),
        };
    }
    getName(): string {
        return this.name;
    }
    getTitle(): string {
        return this.title;
    }
    getHandler(): Function {
        return this.handler;
    }
    getOperations(): {[k: string]: boolean} {
        return this.operations;
    }
    getTypes(): {[k: string]: boolean} {
        return this.types;
    }
    getCondition(): ((ctx: Context, execCtx: Context) => boolean)|undefined {
        return this.condition;
    }
    hasCondition(): boolean {
        return !!this.condition;
    }
    hasHandler(): boolean {
        return !!this.handler;
    }
    isValid(ctx: Context, execCtx: Context): boolean {
        if (this.hasCondition()) {
            if (!ctx || !(<(ctx: Context, execCtx: Context) => boolean>this.getCondition())(ctx, execCtx)) {
                return false;
            }
        }
        return (this.operations[execCtx.get('operation', '_')] && this.types[execCtx.get('type', '_')]) || (execCtx.get('isCoreOperation', false) && this.operations['@']);
    }
    async execute(ctx: Context, execCtx: Context): Promise<void> {
        if (this.hasHandler()) {
            await this.getHandler()(ctx, execCtx);
        }
    }
}

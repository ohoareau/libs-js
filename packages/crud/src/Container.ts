import MissingSingletonContainerError from './errors/MissingSingletonContainerError';

export default class Container {
    protected singletons: {[k: string]: object};
    public constructor() {
        this.singletons = {};
    }
    public check(id): this {
        if (!this.has(id)) {
            throw new MissingSingletonContainerError(id);
        }
        return this;
    }
    public has(id): boolean {
        return !!this.singletons[id];
    }
    public get<T extends object = object>(id: string): T {
        this.check(id);
        return <T>this.singletons[id];
    }
    public set<T extends object = object>(id: string, object: T): this {
        this.singletons[id] = object;
        return this;
    }
    public thunk<T extends object = object>(id: string): () => T {
        return (): T => this.get<T>(id);
    }
}
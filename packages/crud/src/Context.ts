export default class Context {
    constructor(data: object|undefined = undefined) {
        this.setMultiple(data);
    }
    set(k: string, v: any): this {
        this[k] = v;
        return this;
    }
    unset(k: string): this {
        delete this[k];
        return this;
    }
    setMultiple(values: object|undefined) {
        values && Object.assign(this, values);
        return this;
    }
    get(k: string, defaultValue: any|undefined = undefined) {
        return this[k] || defaultValue;
    }
    inc(k: string, offset: number = 1) {
        return this.set(k, (this.get(k, 0) as number) + offset);
    }
    dec(k: string, offset: number = 1) {
        return this.inc(k, - offset);
    }
    has(k: string): boolean {
        return this.hasOwnProperty(k);
    }
    enabled(k: string): boolean {
        return this.has(k) && true === this[k];
    }
    disabled(k: string): boolean {
        return !this.enabled(k);
    }
}

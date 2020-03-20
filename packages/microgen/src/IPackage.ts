export default interface IPackage {
    generate(vars: any): Promise<{[key: string]: Function}>;
}

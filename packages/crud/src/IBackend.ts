export default interface IBackend {
    getName(): string;
    supports(operation: string): boolean;
    execute(operation: string, data: object, options: object);
}

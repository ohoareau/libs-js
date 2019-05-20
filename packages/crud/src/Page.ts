export default interface Page<T> {
    items: T[];
    nextToken?: string;
}

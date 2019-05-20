export default class ApplicationError extends Error {
    public readonly errorType;
    public readonly errorInfo;
    public readonly code: number;
    public readonly key: string;
    public readonly defaultMessage: string;
    public readonly data: {[k: string]: any};
    constructor(code: number, key: string, defaultMessage: string, data: {[k: string]: any} = {}) {
        super(ApplicationError.buildMessage({defaultMessage, code, key }));
        this.code = code;
        this.key = key;
        this.defaultMessage = defaultMessage;
        this.data = data;
        this.errorType = `${code}/${key}`;
        this.errorInfo = data;
    }
    static buildMessage({ defaultMessage, code, key }): string {
        return `E${code} (${key}): ${defaultMessage}`;
    }
    static format(value: any): string {
        switch (typeof value) {
            case 'string':
                return value;
            case 'function':
                return `Function`;
            case 'number':
                return JSON.stringify(value);
            case 'object':
                return JSON.stringify(value);
            default:
                return JSON.stringify(value);
        }
    }
}
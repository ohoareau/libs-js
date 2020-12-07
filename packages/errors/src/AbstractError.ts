import SerializableErrorInterface from './SerializableErrorInterface';

export abstract class AbstractError extends Error implements SerializableErrorInterface {
    protected code: number = 500;
    protected data: any = {};
    protected errorType: string = 'error';
    protected errorInfo: any = {};
    protected shortMessage: string = 'Error';
    protected constructor(
        message: string, code: number, errorType: string = 'error', data: any = {}, errorInfo: any = {}
    ) {
        super(message);
        this.setShortMessage(message.split(/\n/)[0].trim());
        this.setCode(code);
        this.setErrorType(errorType);
        this.setData(data);
        this.setErrorInfo(errorInfo);
    }
    getCode(): number {
        return this.code;
    }
    getMessage(): string {
        return this.message;
    }
    getShortMessage(): string {
        return this.shortMessage;
    }
    getErrorType(): string {
        return this.errorType;
    }
    getData(): any {
        return this.data;
    }
    getErrorInfo(): any {
        return this.errorInfo;
    }
    serialize() {
        return {
            errorType: this.getErrorType(),
            message: this.getShortMessage(),
            code: this.getCode(),
            data: this.getData(),
            errorInfo: this.getErrorInfo(),
        }
    }
    protected setCode(code: number) {
        this.code = code;
    }
    protected setShortMessage(shortMessage: string) {
        this.shortMessage = shortMessage;
    }
    protected setErrorType(errorType: string) {
        this.errorType = errorType;
    }
    protected setData(data: any) {
        this.data = data;
    }
    protected setErrorInfo(errorInfo: any) {
        this.errorInfo = errorInfo;
    }
}

export default AbstractError
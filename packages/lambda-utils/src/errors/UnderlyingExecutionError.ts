export class UnderlyingExecutionError extends Error {
    protected readonly underlyingError: Error;
    protected readonly action: string|undefined;
    protected readonly extras: any;

    constructor(e: Error, action: string|undefined = undefined, extras: any = {}) {
        super(`Underlying ${action || 'execution'} error: ${e.message}`);
        this.underlyingError = e;
        this.action = action;
        this.extras = {...extras};
    }
    getUnderlyingError(): Error {
        return this.underlyingError;
    }
    getAction(): string|undefined {
        return this.action;
    }
    getExtras(): any {
        return this.extras;
    }
    serialize() {
        return {
            httpStatusCode: 500,
            action: this.getAction(),
            underlyingError: {
                message: this.getUnderlyingError().message
            },
            ...(this.getExtras()),
        }
    }
}

export default UnderlyingExecutionError
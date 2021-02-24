type failures = {
    [key: string]: failed_precondition[],
}

type failed_precondition = {
    violation: string,
}

export class PreconditionFailedError extends Error {
    protected readonly failures: failures;
    constructor(failures: failures) {
        super('Precondition failed');
        this.failures = {...failures};
    }
    getFailures() {
        return this.failures;
    }
    serialize() {
        return {
            httpStatusCode: 412,
            failures: this.failures,
        }
    }
}

export default PreconditionFailedError
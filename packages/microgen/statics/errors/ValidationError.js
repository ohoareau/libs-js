class ValidationError extends Error {
    constructor(errors) {
        super(ValidationError.buildMessage(errors));
        this.errors = errors;
    }
    getErrors() {
        return this.errors;
    }
    getErrorMessages() {
        return ValidationError.buildErrorMessages(this.getErrors());
    }
    serialize() {
        return {
            errorType: 'validation',
            data: {},
            errorInfo: this.getErrorMessages(),
            message: 'Validation error',
        };
    }
    static buildErrorMessage(k, v) {
        return `${k}: ${v.message}`;
    }
    static buildErrorMessages(errors) {
        return Object.entries(errors).reduce((m, [k, v]) => {
            m[k] = v.map(vv => vv.message);
            return m;
        }, {});
    }
    static buildFlatErrorMessages(errors) {
        return Object.entries(errors).reduce((m, [k, v]) =>
            m.concat(v.map(vv => ValidationError.buildErrorMessage(k, vv)))
        , []);
    }
    static buildMessage(errors) {
        const n = Object.values(errors).reduce((n, a) => n + a.length, 0);
        return `Validation error (${n})\n\nerrors:\n  - ${ValidationError.buildFlatErrorMessages(errors).join("\n  - ")}`;
    }
}

module.exports = ValidationError;
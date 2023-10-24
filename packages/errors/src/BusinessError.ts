import AbstractError from './AbstractError';

export class BusinessError extends AbstractError {
    constructor(code: number, message: string, value?: string) {
        super(`Business error #${code}: ${message}${value !== undefined ? ` (value: ${value})` : ''}`, code, 'business-error', {code, message, ...(value !== undefined ? {value} : {})});
    }
}

export default BusinessError;
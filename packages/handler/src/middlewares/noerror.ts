export default (cfg: object, ctx: object) => next => async (event, context, callback) => {
    try {
        return await next(event, context, callback);
    } catch (e) {
        return {
            code: e.code || 500,
            key: e.key || 'unexpected',
            message: e.message || 'unexpected error',
            errorType: e.errorType || 'unexpected',
            data: e.data || undefined,
            errorInfo: e.errorInfo || e.data || undefined,
        };
    }
};
export const serialize = e => ((e instanceof Error) && (<any>e).serialize) ? (<any>e).serialize() : ({
    errorType: e.name || 'Error',
    message: e.message || 'Error',
    data: {},
    errorInfo: {},
});

export default {
    priority: 1000,
    supports: () => true,
    serialize,
}
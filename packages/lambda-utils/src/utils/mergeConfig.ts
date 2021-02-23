export function mergeConfig(a, b) {
    return {
        ...b,
        ...a,
        statics: {
            ...(b.statics || {}),
            ...(a.statics || {}),
        },
        actions: {
            ...(b.actions || {}),
            ...(a.actions || {}),
        },
        routes: [
            ...(a.routes || []),
            ...(b.routes || []),
        ],
    }
}

export default mergeConfig
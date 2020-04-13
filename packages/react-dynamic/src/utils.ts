export const prepareErrors = (errors, section: string|undefined = undefined) => {
    section = section || '_';
    const r = (errors || []).reduce((acc, e) => {
        if (!e.errorInfo) return acc;
        if (!e.errorInfo[section as string] || 0 === Object.keys(e.errorInfo[section as string]).length) return acc;
        acc.push(...e.errorInfo[section as string].map(e => e));
        return acc;
    }, []);
    return r.length ? r : undefined;
};

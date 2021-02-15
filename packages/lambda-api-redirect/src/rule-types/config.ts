export async function config({paths = {}, path}: {paths?: any, path: string}) {
    try {
        const data = paths[path];
        if (!data || !data.location) return undefined;
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
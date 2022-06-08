export const arrayize = v => Array.isArray(v) ? v : (undefined !== v ? [v] : []);
export const chunkize = <T = string>(items: T[], size: number): (T[])[] => {
    let i,j;
    const chunks: (T[])[] = [];
    for (i = 0,j = items.length; i < j; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
};
const mapping = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    tiff: 'image/tiff',
    avif: 'image/avif',
    heif: 'image/heif',
    raw: 'image/x-dcraw',
    webp: 'image/webp',
};

export function detectContentTypeFromFileName(name: string): string|undefined {
    if (!name) return undefined;
    return mapping[(name.slice(name.lastIndexOf('.') + 1) || '').toLowerCase()] || undefined;
}

export default detectContentTypeFromFileName
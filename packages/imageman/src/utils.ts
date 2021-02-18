import * as availableTargetTypes from "./target-types";
import * as availableSourceTypes from "./source-types";
import {format} from "./types";

export function parseDsn(string: string) {
    const [type, location = undefined] = string.split(/:\/\//);
    return {type: location ? type : 'file', location: location || type};
}

export async function applyFormat(img: any, format: format) {
    switch (format?.type) {
        case 'png': return (img.png as any)(format.options as any);
        case 'jpeg': return (img.jpeg as any)(format.options as any);
        case 'gif': return (img.gif as any)(format.options as any);
        case 'webp': return (img.webp as any)(format.options as any);
        case 'tiff': return (img.tiff as any)(format.options as any);
        case 'avif': return (img.avif as any)(format.options as any);
        case 'heif': return (img.heif as any)(format.options as any);
        case 'raw': return (img.raw as any)(format.options as any);
        default: return img;
    }
}
export async function describeTarget(output, format: any = undefined) {
    if (!output) throw new Error(`Output is empty`);
    if ('string' === typeof output) {
        switch (output) {
            case 'stdout': output = 'stdout://stdout'; break;
            case 'buffer': output = 'buffer://buffer'; break;
            default:
                if (-1 === output.indexOf('://')) {
                    output = `file://${output}`;
                }
                break;
        }
        output = parseDsn(output);
    }
    const detectedFormatName = detectFormatFromFileName(output.location);
    return {format: format ? ('string' === typeof format ? {type: format} : format) : (detectedFormatName ? {type: detectedFormatName} : output.format), target: {...output}};
}

export async function save(img, target, targetTypes = {}) {
    const allTargetTypes = {...availableTargetTypes, ...targetTypes};
    const targetType = allTargetTypes[target?.type];
    if (!targetType) throw new Error(`Unsupported target type '${target?.type}'`);
    return targetType(img, target)
}

export async function fetch(input, sourceTypes = {}) {
    if (!input) throw new Error(`Input is empty`);
    if (Buffer.isBuffer(input)) return input;
    if ('string' === typeof input) {
        if (-1 === input.indexOf('://')) {
            input = `file://${input}`;
        }
        input = parseDsn(input);
    }
    const allSourceTypes = {...availableSourceTypes, ...sourceTypes};
    const sourceType = allSourceTypes[input?.type];
    if (!sourceType) throw new Error(`Unsupported source type '${input?.type}'`);
    return sourceType(input, sourceType);
}

export const extensions = {
    jpg: 'jpg',
    jpeg: 'jpeg',
    png: 'png',
    gif: 'gif',
    webp: 'webp',
    tiff: 'tiff',
    avif: 'avif',
    heic: 'heif',
    heif: 'heif',
    raw: 'raw',
};

export function detectFormatFromFileName(name): string|undefined {
    if (!name) return undefined;
    return extensions[(name.slice(name.lastIndexOf('.') + 1) || '').toLowerCase()] || undefined;
}

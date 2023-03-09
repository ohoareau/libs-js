import {bounding_boxes_operation} from '../types';
import sharp from 'sharp';

// noinspection JSUnusedLocalSymbols
export default async function operate(img, config: bounding_boxes_operation) {
    return sharp(await sharp(await img.toBuffer())
        .composite([
            {
                input: Buffer.from(buildSvgFromBoundingBoxesConfig(config, await img.metadata())),
                top: 0,
                left: 0,
            },
        ])
        .toBuffer()
    );
}

function buildSvgFromBoundingBoxesConfig(config: bounding_boxes_operation, {width, height}: any) {
    const shapes = config.boxes?.map(b => {
        return `<polygon points="${b.points?.map(p => `${p.x}, ${p.y}`).join(' ') || ''}" fill="${b.bgColor || 'none'}" stroke="${b.borderColor || 'black'}" stroke-width="${b.borderWidth || 1}" />`;
    }).join("\n") || '';
    return `<svg width="${width}" height="${height}">${shapes}</svg>`;
}
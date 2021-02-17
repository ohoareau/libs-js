import {resize_operation} from '../types';
import sharp from 'sharp';

export default async function operate(img, config: resize_operation) {
    return sharp(await sharp(await img.toBuffer()).resize({width: Math.floor(config.width as any), height: Math.floor(config.height as any)}).toBuffer());
}
import {resize_operation} from '../types';
import sharp from 'sharp';

export default async function operate(img, config: resize_operation) {
    return sharp(await sharp(await img.toBuffer()).resize({width: config.width, height: config.height}).toBuffer());
}
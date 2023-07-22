import {trim_operation} from '../types';
import sharp from 'sharp';

export default async function operate(img, config: trim_operation) {
    const {threshold = 10} = config;
    return sharp(await sharp(await img.toBuffer()).trim(threshold).toBuffer());
}
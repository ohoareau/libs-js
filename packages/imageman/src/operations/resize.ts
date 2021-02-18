import {resize_operation} from '../types';
import sharp from 'sharp';

export default async function operate(img, config: resize_operation) {
    const {width, height, ...rest} = config;
    return sharp(await sharp(await img.toBuffer()).resize({
        width: width ? Math.floor(width as any) : undefined,
        height: height ? Math.floor(height as any) : undefined,
        ...rest,
    }).toBuffer());
}
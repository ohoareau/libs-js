import {resize_operation} from '../types';
import sharp from 'sharp';

export default async function operate(img, config: resize_operation) {
    const {width, height, enlarge = true, reduce = true, fit = undefined, position = undefined, bgcolor = undefined, ...rest} = config;
    return sharp(await sharp(await img.toBuffer()).resize({
        width: width ? Math.floor(width as any) : undefined,
        height: height ? Math.floor(height as any) : undefined,
        ...(!enlarge ? {withoutEnlargement: true} : {}),
        ...(!reduce ? {withoutReduction: true} : {}),
        ...(!!bgcolor ? {background: bgcolor} : {}),
        ...(!!fit ? {fit} : {}),
        ...(!!position ? {position} : {}),
        ...rest,
    }).toBuffer());
}
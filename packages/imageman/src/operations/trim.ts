import {trim_operation} from '../types';

export default async function operate(img, config: trim_operation) {
    const {threshold = 10} = config;
    img.trim(threshold);
}

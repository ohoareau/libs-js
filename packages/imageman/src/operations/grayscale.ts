import {grayscale_operation} from '../types';

const operate = async function operate(img, config: grayscale_operation, metadata: any) {
    return img.grayscale();
}

export default operate
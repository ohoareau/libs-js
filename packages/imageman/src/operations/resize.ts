import {resize_operation} from '../types';

const operate = async function operate(img, config: resize_operation) {
    return img.resize({width: config.width, height: config.height});
}

export default operate
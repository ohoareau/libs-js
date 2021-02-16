import {round_corner_operation} from '../types';

const operate = async function operate(img, config: round_corner_operation, {width, height}) {
    return img
        .composite([{
        input: Buffer.from(`<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${config["radius-x"]}" ry="${config["radius-y"]}"/></svg>`),
        blend: 'dest-in'
    }]);
};

export default operate



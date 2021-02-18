import {round_corner_operation} from '../types';

export default async function operate(img, {rx, ry}: round_corner_operation) {
    const {width, height} = await img.metadata();
    rx = parseFloat(`${rx || 0}`) as any;
    ry = parseFloat(`${ry || rx}`) as any;
    img.composite([{
        input: Buffer.from(`<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${ry}"/></svg>`),
        blend: 'dest-in'
    }]);
}

import {input, output, operations} from './types';
import fs from "fs";
import sharp from 'sharp';


async function build({input, operations = [], output}: {input: input, operations?: operations, output: output}) {

    const roundedCorners = Buffer.from(
        fs.readFileSync(input, 'utf8'));

    const img = sharp(roundedCorners);

    operations.forEach(operation => {
    })

    const r = img
        .png()
        .toFile(output)
    ;

    return r;
}

export default build
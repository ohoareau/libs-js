import {input, output, operations} from './types';
import fs from "fs";
import sharp from 'sharp';
import * as availableOperations from './operations'

async function build({input, operations = [], output}: {input: input, operations?: operations, output: output}) {
    const img = sharp(Buffer.from(fs.readFileSync(input)), {sequentialRead: true});
    const format = output.split('.').pop();
    const metadata = await img.metadata();

    operations.forEach(operation => {
         availableOperations[operation.type](img, operation, metadata);
    });

    return img
        .toFormat(format)
        .toFile(output);
}

export default build
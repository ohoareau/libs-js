import {input, output, operations} from './types';
import fs from "fs";
import sharp from 'sharp';
import * as availableOperations from './operations'

async function build({input, operations = [], output}: {input: input, operations?: operations, output: output}) {
    return (await operations.reduce(async (acc, operation) => {
        acc = (await acc) || acc;
        try{
            if (!availableOperations[operation.type]) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Unknown operation: ${operation.type}`);
            }
            return (await availableOperations[operation.type](acc, operation)) || acc ;
        } catch (e) {
            console.warn(`Warning: ${e.message}`);
            return acc;
        }

    }, Promise.resolve(sharp(Buffer.from(fs.readFileSync(input)), {sequentialRead: true})))).toFormat(output.split('.').pop()).toFile(output);

}

export default build
import {imageman_args} from './types';
import sharp from 'sharp';
import * as availableOperations from './operations'
import {applyFormat, describeTarget, save, fetch} from "./utils";

async function build({input, operations = [], output, format = undefined, sourceTypes = {}, targetTypes = {}}: imageman_args) {
    const source = await fetch(input, sourceTypes) as Buffer|ReadableStream
    let img = (await operations.reduce(async (acc, operation) => {
        acc = (await acc) || acc;
        try{
            if (!availableOperations[operation.type]) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Unknown operation: ${operation.type}`);
            }
            return (await availableOperations[operation.type](acc, operation)) || acc ;
        } catch (e) {
            console.warn(`Warning: ${operation.type} - ${e.message}`);
            return acc;
        }

    }, Promise.resolve(sharp(source, {sequentialRead: true}))));
    const {format: finalFormat, target} = await describeTarget(output, format);
    finalFormat && (img = await applyFormat(img, finalFormat));
    return save(img, target, targetTypes);
}

export {detectFormatFromFileName} from './utils';
export {imageman_args} from './types';

export default build
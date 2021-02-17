import {imageman_args} from './types';
import sharp from 'sharp';
import * as availableOperations from './operations'
import * as availableTargetTypes from './target-types';
import * as availableSourceTypes from './source-types';
import {parseDsn, parseFormat} from "./utils";

async function build({input, operations = [], output, sourceTypes = {}, targetTypes = {}}: imageman_args) {
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
            console.warn(`Warning: ${e.message}`);
            return acc;
        }

    }, Promise.resolve(sharp(source, {sequentialRead: true}))));
    const {format, target} = await describeTarget(output);
    format && (img = img.toFormat(format));
    return save(img, target, targetTypes);
}

async function describeTarget(output) {
    if (!output) throw new Error(`Output is empty`);
    if ('buffer' === output) output = 'buffer://';
    if ('string' === typeof output) {
        if (-1 === output.indexOf('://')) {
            output = `file://${output}`;
        }
        output = parseDsn(output);
    }
    (output && output.location && !output.format && ('string' === typeof output.location)) && (output.format = parseFormat(output.location));
    const {format, ...target} = output;
    return {format, target};
}

async function save(img, target, targetTypes = {}) {
    const allTargetTypes = {...availableTargetTypes, ...targetTypes};
    const targetType = allTargetTypes[target?.type];
    if (!targetType) throw new Error(`Unsupported target type '${target?.type}'`);
    return targetType(img, target)
}

async function fetch(input, sourceTypes = {}) {
    if (!input) throw new Error(`Input is empty`);
    if (Buffer.isBuffer(input)) return input;
    if ('string' === typeof input) {
        if (-1 === input.indexOf('://')) {
            input = `file://${input}`;
        }
        input = parseDsn(input);
    }
    const allSourceTypes = {...availableSourceTypes, ...sourceTypes};
    const sourceType = allSourceTypes[input?.type];
    if (!sourceType) throw new Error(`Unsupported source type '${input?.type}'`);
    return sourceType(input, sourceType);
}

export default build
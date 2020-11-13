import formats from './formats';
export {default as IFormat} from './IFormat';

export const validate = (def: any): void => {
    if (!def.format) throw new Error(`No format version specified`);
    if (!formats[def.format]) throw new Error(`Unknown format version ${def.format}`);
    const format = new formats[def.format];
    format.validate(def);
    return;
}
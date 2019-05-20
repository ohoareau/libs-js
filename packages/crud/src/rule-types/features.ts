import { defaults } from './defaults';

export const features = (defs: {[k: string]: boolean} = {}, field: string = 'features') => [
    defaults({[field]: defs}),
];

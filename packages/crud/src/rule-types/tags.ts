import { defaults } from './defaults';

export const tags = (defs: string[] = [], field: string = 'tags') => [
    defaults({[field]: defs}),
];

import { values } from './values';

export const uuid = (field: string = 'id') => values({[field]: '@uuid'});

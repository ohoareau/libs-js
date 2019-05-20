import { values } from './values';

export const ttl = (delay: number, field: string = 'ttl') => [
    values({[field]: Math.floor((Date.now() / 1000) + delay)}, undefined, `set ${field}${field !== 'ttl' ? ' as ttl' : ''} with a delay of ${delay} seconds from current date/time`),
];
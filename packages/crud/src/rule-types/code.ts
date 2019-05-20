import { values } from './values';

export const code = (
    prefix: string|undefined = undefined,
    format: string = '3C3D',
    suffix: string|undefined = undefined,
    field: string = 'code'
) => {
    return values({[field]: `@code/${prefix || ''}/${format}/${suffix || ''}`});
};

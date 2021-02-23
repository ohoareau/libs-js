import {ctx} from '@ohoareau/lambda-utils';

export async function config(ctx: ctx) {
    try {
        const data = ctx.config?.paths[ctx.query.file || ''];
        if (!data || !data.location) return undefined;
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}
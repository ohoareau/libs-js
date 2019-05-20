import * as generators from "../generators";
import BadValueFieldError from "../errors/BadValueFieldError";
import Context from "../Context";

const generateFieldValue = (field, dsn): string => {
    const [prefix, format, suffix] = dsn.replace(/^\//, '').split(/\//);
    const generatorName = `generate${format.substr(0, 1).toUpperCase()}${format.substr(1)}`;
    if (!generators[generatorName]) {
        throw new BadValueFieldError(field, format, Object.keys(generators).map(k => {
            const format = k.replace(/^generate/, '');
            return `${format.substr(0, 1).toLowerCase()}${format.substr(1)}`;
        }));
    }
    return `${prefix || ''}${generators[generatorName]()}${suffix || ''}`;
};


export default (defs, ctx: Context, execCtx: Context) => {
    defs = ('function' === typeof defs) ? defs(ctx, execCtx) : defs;
    return Object.keys(defs).reduce((acc, k) => {
        let v = defs[k];
        if (('string' === typeof defs[k]) && ('@' === defs[k].substr(0, 1))) {
            const func = defs[k].substr(1, 4);
            switch (func) {
                case 'uuid':
                    v = generateFieldValue(k, '//uuid/');
                    break;
                case 'code':
                    v = generateFieldValue(k, defs[k].substr(5));
                    break;
            }
        }
        acc[k] = v;
        return acc;
    }, {});
}

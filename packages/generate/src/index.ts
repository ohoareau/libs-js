import {v4 as uuid} from 'uuid';

export const generateUuidValue = () => uuid();

export const generateLettersValue = ({siblings = []}) => {
    let count = siblings.length;
    let t, n, m;
    let it = 0;
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    do {
        n = count % 26;
        m = Math.floor(count / 26);
        t = '';
        for (let i = 0; i < m; i++) {
            t += chars.charAt(i);
        }
        t += chars.charAt(n);
        t = t.toUpperCase();
        it++;
        count++;
    } while (!!siblings.find(ii => ii['name'] === t) && it < 100);
    return t;
};

export const generatePredefinedValue = ({predefined, siblings = []}) => {
    let count = siblings.length;
    const defaultNames = predefined.slice(0, -1);
    const fallback = [...predefined].pop();
    let t;
    let it = 0;
    do {
        t = (defaultNames[count] || fallback).replace('{{index}}', count + 1);
        count++;
    } while (!!siblings.find(ii => ii['name'] === t) && it < 100);
    return t;
};

const generate = ({type, ...params}, ctx: any = {}) => {
    type = type || 'value';
    switch (type) {
        case 'value':
            return params.value;
        case 'generated':
            const {generator, ...localCtx} = params;
            switch (generator) {
                case 'letters': return generateLettersValue({...localCtx, ...ctx});
                case 'predefined': return generatePredefinedValue({...localCtx, ...ctx});
                default: return generateUuidValue();
            }
        default:
            return undefined;
    }
};
export const generateValues = (settings, ctx) =>
    Object.entries(settings).reduce((acc, [k, v]) => {
        acc[k] = generate(<any>v, {...ctx, property: k});
        return acc;
    }, {})
;

export default generate
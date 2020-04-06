import {v4 as uuid} from 'uuid';

const clone = (v: any): any => {
    if (undefined === v) return v;
    if (null === v) return v;
    if (Array.isArray(v)) return v.map(clone);
    if ('object' === typeof v) return Object.entries(v).reduce((acc, [kk, vv]) =>
        Object.assign(acc, {[kk]: clone((kk === 'id') ? uuid() : vv)})
    , {});
    return v;
};

export default clone
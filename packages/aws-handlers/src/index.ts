import * as factories from './factories';

export const createHandler = (type, config = {}) => {
    const fn = factories[type];

    if (!fn) throw new Error(`Uknown handler type '${type}'`);

    return fn(config);
}

export default createHandler
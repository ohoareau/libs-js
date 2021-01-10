import * as factories from './factories';

export const createHandler = (type, config = {}) => {
    const fn = factories[type];

    if (!fn) throw new Error(`Unknown handler type '${type}'`);

    return fn(config);
}

export const s3eventHandler = createHandler('s3event', {});

export default createHandler
import * as factories from './factories';

export const createHandler = (type, config = {}) => {
    const fn = factories[type];

    if (!fn) throw new Error(`Unknown handler type '${type}'`);

    return fn(config);
}

export const createS3eventHandler = config => createHandler('s3event', config);
export const createSQSeventHandler = config => createHandler('sqsevent', config);

export default createHandler
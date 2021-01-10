// code is inspired from https://github.com/sequelize/sequelize/pull/12642/files#diff-5754411877ebb2fac1efed3e58e64621cad3e11c597ca66b95495847f5a1f0cc

import {Sequelize} from 'sequelize';

const dbs = {} as {[key: string]: Sequelize};

export const getDb = async (options = {}) => {
    const {type = 'default'} = options as any;
    // re-use the sequelize instance across invocations to improve performance
    if (!dbs[type]) {
        dbs[type] = await require(`./loaders/${type}`).default(options) as Sequelize
    } else {
        // restore `getConnection()` if it has been overwritten by `close()`
        if (dbs[type].connectionManager.hasOwnProperty('getConnection')) {
            delete dbs[type].connectionManager.getConnection;
        }
    }
    return dbs[type];
}

export default getDb
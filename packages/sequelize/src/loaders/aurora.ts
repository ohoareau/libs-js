import {Sequelize} from 'sequelize';

export default async ({
    name = undefined,
    user = undefined,
    password = undefined,
    host = undefined,
    maxPools = 2, // recommandation: small value, > 1
    minPools = 0,
    idlePools = 0,
    acquirePool = 60000, // recommandation: >= delay of aurora startup
    evictPool = 600000, // recommandation: must be equal to the timeout value for lambda max in AWS/Terraform
    connectTimeout = 120000, // recommandation: >= delay of aurora startup
}) => {
    const sequelize = new Sequelize(
        name || process.env.db_name || 'dbname',
        user || process.env.db_user || 'dbuser',
        password || process.env.db_password,
        {
            dialect: 'mysql',
            host: host || process.env.db_host,
            logging: false,
            pool: {
                max: maxPools,
                min: minPools,
                idle: idlePools,
                acquire: acquirePool,
                evict: evictPool,
            },
            dialectOptions: {
                multipleStatements: true,
                connectTimeout,
            }
        }
    );
    await sequelize.authenticate();

    return sequelize;
}
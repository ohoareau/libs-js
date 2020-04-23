import Generator from './Generator';
export {default as Generator} from './Generator';

const fs = require('fs-extra');
const path = require('path');

export default async (configFile = './microgen.js', targetDir = './packages', vars: any = {}) => {
    const configFileRealPath = fs.realpathSync(configFile);
    return await new Generator({
        ...require(configFileRealPath),
    }).generate({
        targetDir,
        write: true,
        configFileDir: path.dirname(configFileRealPath),
        ...vars,
    });
}
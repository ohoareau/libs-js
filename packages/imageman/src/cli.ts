import build from './index';
import path from 'path';

async function main(argv) {
    if (!argv[3]) throw new Error('Syntax: imageman <input> <operationsFile> [[<output>] [<configFile>]]');

    const operations = require(path.resolve(argv[3]));
    return build({
        output: 'stdout',
        ...(argv[5] ? (require(path.resolve(argv[5])) || {}) : {}),
        input: argv[2],
        ...((operations && operations.length) ? {operations} : {}),
        ...(argv[4] ? {output: argv[4] === '-' ? 'stdout' : argv[4]} : {}),
    })
}

export default main
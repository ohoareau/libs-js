import build from './index';

async function main(argv) {
    if (!argv[4]) throw new Error('Syntax: imageman <inputFile> <operationsFile> <outputFile>');

    return build({
        input: argv[2],
        operations: require(argv[3]),
        output: argv[4],
    })
}

export default main
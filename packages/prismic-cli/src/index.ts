import {CommandModule} from "yargs";

const getCmd = (name: string): CommandModule => require(`./commands/${name}`);

export const cli = async () => {
    require('yargs') // eslint-disable-line
        .command(getCmd('get-collection'))
        .command(getCmd('get-document'))
        .command(getCmd('get-documents'))
        .command(getCmd('get-documents-with-tag'))
        .command(getCmd('search'))
        .option('verbose', {
            alias: 'v',
            type: 'boolean',
            description: 'Run with verbose logging'
        })
        .option('format', {
            alias: 'f',
            type: 'string',
            choices: ['json', 'js', 'es6', 'ts'],
            description: 'specify output format',
            default: 'json',
        })
        .option('by', {
            alias: 'b',
            type: 'string',
            description: 'specify property to use as index',
        })
        .option('hashify', {
            alias: 'x',
            type: 'string',
            description: 'specify sub-property to use as key and sub-property to use as value ("keyprop,valueprop")',
        })
        .option('idFormatter', {
            alias: 'z',
            type: 'string',
            description: 'name of the formatter to use to format the value of the id/key',
        })
        .option('mergeWith', {
            alias: 'm',
            type: 'string',
            description: 'specify doc to use as default values',
        })
        .option('data', {
            alias: 'd',
            type: 'boolean',
            description: 'specify to retrieve only data, no metadata',
            default: false,
        })
        .option('token', {
            alias: 't',
            type: 'string',
            description: 'specify the Prismic token to use',
            default: process.env.PRISMIC_API_ACCESS_TOKEN,
        })
        .option('repository', {
            alias: 'r',
            type: 'string',
            description: 'specify the Prismic repository to use',
            demandOption: true,
        })
        .argv
};

export default cli
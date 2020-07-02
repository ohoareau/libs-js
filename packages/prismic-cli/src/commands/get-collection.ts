import prismic from "../services/prismic";
import {out} from "../utils";

export const command = 'get-collection <name>';

export const describe = 'retrieve the content of the specified collection';

export const builder = yargs => {
    yargs.positional('name', {describe: 'name of the collection'})
};

export const handler = async argv => out(prismic(argv).getCollection(argv.name), argv);
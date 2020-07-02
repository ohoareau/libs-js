import prismic from "../services/prismic";
import {out} from "../utils";

export const command = 'search <text>';

export const describe = 'retrieve the content of the specified documents';

export const builder = yargs => {
    yargs.positional('text', {describe: 'text to search'})
};

export const handler = async argv => out(prismic(argv).search(argv.text), argv);
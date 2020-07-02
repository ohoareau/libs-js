import prismic from "../services/prismic";
import {out} from "../utils";

export const command = 'get-document <uid>';

export const describe = 'retrieve the content of the specified document';

export const builder = yargs => {
    yargs.positional('uid', {describe: 'uid of the document'})
};

export const handler = async argv => out(prismic(argv).getDocument(argv.uid), argv);

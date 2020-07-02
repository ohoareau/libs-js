import prismic from "../services/prismic";
import {out} from "../utils";

export const command = 'get-documents-with-tag <tags>';

export const describe = 'retrieve the content of the specified documents';

export const builder = yargs => {
    yargs.positional('tags', {describe: 'tags separated by comma'})
};

export const handler = async argv => out(prismic(argv).getDocumentsWithTags(argv.tags.split(',')), argv);
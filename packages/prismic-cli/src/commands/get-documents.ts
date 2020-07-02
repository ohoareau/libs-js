import prismic from "../services/prismic";
import {out} from "../utils";

export const command = 'get-documents';

export const describe = 'retrieve the content of the documents';

export const builder = yargs => {
};

export const handler = async argv => out(prismic(argv).getDocuments(), argv);
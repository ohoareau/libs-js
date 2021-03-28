import {parse} from "./parse";

export async function processFile(path: string, init: Function): Promise<any> {
    return parse(require('fs').readFileSync(path, 'utf8'), {init});
}

export default processFile
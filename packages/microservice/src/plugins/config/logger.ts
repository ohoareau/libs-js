import {Context, Config} from "../..";

export default (ctx: Context, c: Config): void => {
    c.log = c.debug
        ? (...args): void => {
            console.log(`MICROSERVICE [${c.full_type}]`, ...args);
        }
        : () => {}
    ;
}
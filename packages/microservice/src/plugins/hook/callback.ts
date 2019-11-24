import {Definition, Map} from "../..";

export default (hc: Definition) => (...args) => (<Map>hc.config).callback(...args);
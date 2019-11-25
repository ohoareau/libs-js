import {Map} from "../..";

export default (hc: Map) => (...args) => hc.callback(...args);
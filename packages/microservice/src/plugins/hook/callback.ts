import {Map} from "../..";

export default (hc: Map) => async (...args) => hc.callback(...args);
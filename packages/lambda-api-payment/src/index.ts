import defaultConfig from './default-config';
import {createRouterHandler} from "@ohoareau/lambda-utils";

export default () => createRouterHandler(defaultConfig)
import { default as invokableBackendClass } from './LambdaInvokableBackend';
import {registerInvokableBackendType} from "@ohoareau/microservice";

export default invokableBackendClass;

registerInvokableBackendType('lambda', invokableBackendClass);

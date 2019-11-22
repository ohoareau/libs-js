import { default as eventSourceBackendClass } from './SqsEventSourceBackend';
import {registerEventSourceBackendType} from "@ohoareau/microservice";

export default eventSourceBackendClass;

registerEventSourceBackendType('sqs', eventSourceBackendClass);

import { default as backendClass } from './DynamooseBackend';
import {registerBackendType} from "@ohoareau/microservice";

export default backendClass;

registerBackendType('dynamoose', backendClass);

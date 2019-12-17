import p from '../plugins/authorizer/lambda';
import {register} from "..";
register('authorizer', 'lambda', p);
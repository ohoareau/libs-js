import p1 from '../plugins/hook/cognito-user-create';
import p2 from '../plugins/hook/cognito-user-remove';
import {register} from "..";
register('hook', 'cognito-user-create', p1);
register('hook', 'cognito-user-remove', p2);
import {uuid} from '../../validators';

export default () => ({type: 'string', validators: [uuid()]});
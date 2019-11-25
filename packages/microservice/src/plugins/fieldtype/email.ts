import {email} from "../../validators";

export default () => ({type: 'string', validators: [email()]});
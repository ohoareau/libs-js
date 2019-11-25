import {values} from "../../validators";

export default ({steps}) => ({type: 'string', validators: [values(steps)]});
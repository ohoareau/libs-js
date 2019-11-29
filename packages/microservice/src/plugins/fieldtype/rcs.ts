import {maxLength} from "../../validators";

export default () => ({type: 'string', validators: [maxLength(100)]})
import {maxLength, url} from "../../validators";

export default () => ({type: 'string', validators: [url(), maxLength(1024)]})
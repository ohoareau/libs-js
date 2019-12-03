import {arn} from "../../validators";

export default () => ({type: 'string', validators: [arn()]});
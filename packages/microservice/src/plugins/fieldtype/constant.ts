import {values} from "../../validators";

export default ({values: allowedValues = []}: {values: string[]}) => ({type: 'string', validators: [values(allowedValues)]})
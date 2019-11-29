import {values} from "../../validators";

export default () => ({type: 'string', validators: [values([
    'FR', 'GB', 'PT', 'ES', 'IT', 'BE', 'LU', 'CH', 'DE',
])]})
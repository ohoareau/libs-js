import {match} from "../../validators";

export default () => ({type: 'string', validators: [match({pattern: '^[0-9]{14}$', message: 'Not a valid SIRET'})]})
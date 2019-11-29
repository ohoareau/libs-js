import {match} from "../../validators";

export default () => ({type: 'string', validators: [match({pattern: '^[0-9]{7,13}$', message: 'Not a valid DUNS number'})]})
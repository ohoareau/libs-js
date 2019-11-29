import {match} from "../../validators";

export default () => ({type: 'string', validators: [match({pattern: '^[0-9]{4}[A-Z]{1}$', flags: 'i', message: 'Not a valid APE code'})], upper: true})
import {match} from "../../validators";

export default () => ({type: 'string', validators: [match({pattern: '^[A-Z]{2,3}.{7,13}$', flags: 'i', message: 'Not a valid VAT Number'})], upper: true})
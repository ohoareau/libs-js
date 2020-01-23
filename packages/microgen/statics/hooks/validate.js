const ValidationError = require('../errors/ValidationError');

const buildValidator = ({type, config = {}}) =>
    (require('../utils/validators')[type] || require('../utils/validators').unknown)(config)
;

module.exports = ({model: {fields = {}, privateFields = {}, requiredFields = {}, validators = {}}, required = true}) => async data => {
    if (!data.data) data.data = {};
    const localCtx = {data: data.contextData || {}};
    const errors = {};
    Object.keys(data.data).forEach(k => {
        if (!fields[k] || privateFields[k]) delete data.data[k];
    });
    required && Object.keys(requiredFields).forEach(k => {
        if (!data.data.hasOwnProperty(k)) {
            if (!errors[k]) errors[k] = [];
            errors[k].push(new Error('Field is required'));
        }
    });
    await Promise.all(Object.entries(data.data).map(async ([k, v]) => {
        if (!validators[k]) return;
        await Promise.all(validators[k].map(async validator => {
            validator = buildValidator(validator);
            if (!(await validator.test(v, localCtx))) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(await validator.message(v, localCtx)));
            }
        }));
    }));
    if (0 < Object.keys(errors).length) throw new ValidationError(errors);
    data.contextData = Object.assign(data.contextData || {}, localCtx.data || {});
    return data;
};
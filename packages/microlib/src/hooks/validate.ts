import ValidationError from '../errors/ValidationError';

const getValidator = (type, dir) => {
    let v;
    if ('@' === type.substr(0, 1)) {
        v = require('../validators');
        type = type.substr(1);
    } else {
        v = require(`${dir}/validators`);
    }
    return v[type] || v.unknown;
};

export default ({model: {fields = {}, privateFields = {}, requiredFields = {}, validators = {}}, required = true, dir}) => async data => {
    if (!data.data) data.data = {};
    const localCtx = {data: data.contextData || {}};
    const errors = {};
    Object.keys(data.data).forEach(k => {
        if (!fields[k] || privateFields[k]) {
            if (!data.autoPopulated || !data.autoPopulated[k]) {
                delete data.data[k];
            }
        }
    });
    required && Object.keys(requiredFields).forEach(k => {
        if (!data.data.hasOwnProperty(k)) {
            if (!errors[k]) errors[k] = [];
            errors[k].push(new Error('Field is required'));
        }
    });
    await Promise.all(Object.entries(data.data).map(async ([k, v]) => {
        if (!validators[k]) return;
        await Promise.all(validators[k].map(async ({type, config = {}}) => {
            const validator: {test: Function, message: Function} = getValidator(type, dir)({...config, dir});
            if (!(await validator.test(v, localCtx))) {
                if (!errors[k]) errors[k] = [];
                errors[k].push(new Error(await validator.message(v, localCtx)));
            }
        }));
    }));
    if (0 < Object.keys(errors).length) throw new ValidationError(errors);
    data.contextData = Object.assign(data.contextData || {}, localCtx.data || {});
    return data;
}
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
    if ('function' !== typeof data.data.hasOwnProperty) data.data = {...data.data};
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
            const validator: {test?: Function, message?: Function, check?: Function, postValidate?: Function} = getValidator(type, dir)({...config, dir});
            let isInError = false;
            if (validator.test) {
                if (!(await validator.test(v, localCtx))) {
                    if (!errors[k]) errors[k] = [];
                    errors[k].push(new Error((validator.message && (await validator.message(v, localCtx))) || 'Validation error'));
                    isInError = true;
                }
            }
            if (validator.check) {
                try {
                    await validator.check(v, localCtx);
                } catch (e) {
                    if (!errors[k]) errors[k] = [];
                    if (e) {
                        if (e.getErrors) {
                            e.getErrors().forEach(ee => errors[k].push(ee));
                        } else {
                            errors[k].push(new Error(e.message || 'Validation error'));
                        }
                    } else {
                        errors[k].push(new Error('Validation error'));
                    }
                    isInError = true;
                }
            }
            if (!isInError && validator.postValidate) {
                try {
                    await validator.postValidate(k, v, data.data, localCtx, data);
                } catch (e) {
                    if (!errors[k]) errors[k] = [];
                    if (e) {
                        if (e.getErrors) {
                            e.getErrors().forEach(ee => errors[k].push(ee));
                        } else {
                            errors[k].push(new Error(e.message || 'Post Validation error'));
                        }
                    } else {
                        errors[k].push(new Error('Post Validation error'));
                    }
                }
            }
        }));
    }));
    if (0 < Object.keys(errors).length) throw new ValidationError(errors);
    data.contextData = Object.assign(data.contextData || {}, localCtx.data || {});
    return data;
}
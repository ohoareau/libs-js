import React from 'react';
import component from '@ohoareau/react-component';
import SelectField from '../fields/SelectField';
import FormField, {FormFieldProps, buildI18nFieldKey} from '../FormField';

export const convertToSelectValues = (i18n, values, defaultValue = undefined, sort = true, context) => {
    let vv, vl;
    const result = (values || []).reduce((acc, v) => {
        if (('object' === typeof v)) {
            vv = v.id;
            vl = v.name;
        } else {
            vv = v;
            vl = (v as string).replace(/\*$/, '');
        }
        if (/\*$/.test(vv)) {
            vv = vv.substr(0, vv.length - 1);
            acc.defaultId = acc.defaultId || vv;
        }
        vl = i18n.t(buildI18nFieldKey({...context, kind: 'options', suffix: `${vv}_label`}).concat(vl));
        acc.labels.push([vv, vl]);
        return acc;
    }, {labels: [], defaultId: defaultValue});
    sort && (result.labels as [string, string][]).sort((a, b) => a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0));
    return result;
};

export const SelectFormField = component<SelectFormFieldProps>(undefined, ({t = () => {}, tReady = false, i18n, context, defaultValue, sort = true, formatOption, resultKey, values, extraProps = {}, ...props}: SelectFormFieldProps) => {
    const {labels, defaultId} = convertToSelectValues(i18n, values, defaultValue, sort, {...context, name: props.name, prefix: props.prefix});
    return (
        <FormField component={SelectField}
                   extraProps={{
                       defaultValue: defaultId,
                       ...extraProps,
                       ...(resultKey ? {resultKey} : {}),
                       ...(formatOption ? {formatOption} : {}),
                   }}
                   {...props}
        >
            {labels.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </FormField>
    );
});

export interface SelectFormFieldProps extends FormFieldProps {
    t?: Function,
    tReady?: boolean,
    context?: any,
    defaultValue?: any,
    sort?: boolean,
    formatOption?: any,
    resultKey?: any,
    values?: any,
    extraProps?: any,
}

export default SelectFormField
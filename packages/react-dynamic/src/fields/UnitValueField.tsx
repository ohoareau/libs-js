import React, {useCallback} from 'react';
import Select from '@material-ui/core/Select';
import component from '@ohoareau/react-component';
import InputLabel from '@material-ui/core/InputLabel';
import FieldHelper from '../FieldHelper';
import FormControl from '@material-ui/core/FormControl';
import MuiTextField from '@material-ui/core/TextField';

const UnitValueField = component<UnitValueFieldProps>({
    root: {
    },
    container: {
        display: 'flex',
    },
    valueContainer: {
        flex: 5,
        flexGrow: 1,
    },
    unitContainer: {
        flex: 1,
    },
}, ({classes = {}, t = () => {}, tReady = false, i18n, errors, placeholder, default: defaultValue, label, unitLabel, input, units = [], kind, defaultUnit, meta: {touched, invalid, error}, ...props}: UnitValueFieldProps) => {
    const value = input.value ? input.value : {value: defaultValue || '', unit: defaultUnit || [...units].shift()};
    const onValueChange = useCallback(event => input.onChange({value: event.target.value, unit: value.unit}), [input, value]);
    const onUnitChange = useCallback(event => input.onChange({value: value.value, unit: event.target.value}), [input, value]);
    const onValueBlur = useCallback(event => input.onBlur({value: event.target.value, unit: value.unit}), [input, value]);
    const onUnitBlur = useCallback(event => input.onBlur({value: value.value, unit: event.target.value}), [input, value]);
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.valueContainer}>
                    <MuiTextField
                        fullWidth={true}
                        label={label}
                        placeholder={placeholder || label}
                        error={(touched && invalid) || (!!errors && !!errors.length)}
                        helperText={((touched && error) || ((!!errors && errors.length) ? errors.map(x => x.message).join('; ') : undefined))}
                        {...input}
                        onChange={onValueChange}
                        onBlur={onValueBlur}
                        value={value.value}
                        {...props}
                    />
                </div>
                <div className={classes.unitContainer}>
                    <FormControl>
                        <InputLabel>{unitLabel}</InputLabel>
                        <Select native value={value.unit} onChange={onUnitChange} onBlur={onUnitBlur}>
                            {units.map(u => <option key={u} value={u}>{t(`field_unit_${kind}_${u}_label`)}</option>)}
                        </Select>
                        <FieldHelper touched={touched}  error={error} />
                    </FormControl>
                </div>
            </div>
        </div>
    );
});

export interface UnitValueFieldProps {
    classes?: {[key: string]: any},
    t?: Function,
    tReady?: boolean,
    i18n?: any,
    errors?: any,
    placeholder?: any,
    default?: any,
    label?: any,
    unitLabel?: any,
    input?: any,
    units?: any,
    kind?: any,
    defaultUnit?: any,
    meta?: any,
}

export default UnitValueField
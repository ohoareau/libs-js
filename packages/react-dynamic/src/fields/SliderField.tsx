import React, {useCallback} from 'react';
import Slider from '@material-ui/core/Slider';
import component from '@ohoareau/react-component';

export const SliderField = component<SliderFieldProps>({
    root: {
        width: '100%',
        marginTop: 50,
    },
}, ({classes = {}, errors, placeholder, label, unit, interval = [0, 100], step = 1, input, ...props}: SliderFieldProps) => {
    const buildValueText = useCallback(value => `${value}${unit ? ` ${unit}` : ''}`, [unit]);
    let value = input.value;
    if (!value) {
        value = [...interval];
        input.onChange(value);
    }
    const onChange = (event, newValue) => input.onChange(newValue);
    const buildMarks = () => [
        {value: interval[0], label: buildValueText(interval[0])},
        {value: interval[1], label: buildValueText(interval[1])},
    ];
    return (
        <Slider
            className={classes.root}
            getAriaValueText={buildValueText}
            label={label}
            placeholder={placeholder || label}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={step}
            marks={buildMarks()}
            min={interval[0]}
            max={interval[1]}
            {...input}
            {...props}
            value={value}
            onChange={onChange}
        />
    );
}, undefined, {i18n: false});

export interface SliderFieldProps {
    classes?: {[key: string]: any},
    errors?: any,
    placeholder?: any,
    label?: any,
    unit?: any,
    interval?: any,
    step?: number,
    input?: any,
}

export default SliderField
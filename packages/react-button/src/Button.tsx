import React, {ComponentType} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Spinner from './Spinner';
import StyledButton, {StyledButtonProps} from './StyledButton';
import {withTranslation} from 'react-i18next';

// @ts-ignore
const Button: ComponentType<ButtonProps> = withTranslation()(({tooltip, color, startIcon, endIcon, variant = 'contained', noLabel, dispatch, tReady, size, t = () => {}, submitting, label, noStartIcon, ...props }: ButtonProps) => {
    const compProps: StyledButtonProps = {
        disableElevation: true,
        size,
        disabled: submitting,
        // @ts-ignore
        ...((variant === 'default') ? {} : {variant}),
        color,
        ...(submitting ? ({startIcon: <Spinner size={24} />}) : ((startIcon && !noStartIcon) ? {startIcon} : {})),
        ...(endIcon ? {endIcon} : {}),
        ...props,
        ...(props.onClick ? {} : {type: 'submit'}),
    };
    const content = noLabel ? <></> : (label || t([`buttons_${props.type}_label`, props.type]));
    return tooltip
        ? <Tooltip title={tooltip}><StyledButton {...compProps}>{content}</StyledButton></Tooltip>
        : <StyledButton {...compProps}>{content}</StyledButton>
    ;
});

export type ButtonProps = StyledButtonProps & {
    tooltip?: any,
    color?: string,
    startIcon?: any,
    endIcon?: any,
    variant?: string,
    noLabel?: boolean,
    dispatch?: any,
    tReady?: any,
    size?: any,
    t?: Function,
    submitting?: boolean,
    label?: any,
    noStartIcon?: boolean,
};

export default Button
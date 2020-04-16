import Slider from '@material-ui/core/Slider';
import component from '@ohoareau/react-component';

export const ZoomSlider = component(theme => ({
    root: {
        color: theme.palette.primary.light,
        height: 6,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 0,
    },
    rail: {
        height: 8,
        borderRadius: 0,
    },
}), Slider, undefined, {i18n: false});

export default ZoomSlider
import React, {useCallback} from 'react';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import MuiTabs from '@material-ui/core/Tabs';
import RawSpan from './RawSpan';
import Tooltip from '@material-ui/core/Tooltip';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';

const Tabs = component<TabsProps>({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: 'rgb(250, 250, 250)',
    },
}, ({classes = {}, optimize = false, padding = true, tabs = [], tab, onChange, extraProps = {}}: TabsProps) => {
    tabs = tabs.filter(x => !!x);
    const defaultTab = tabs.find(t => t.default) || {};
    tab = tab || defaultTab.name;
    const handleChange = useCallback((event, newValue) => {
        onChange(newValue, newValue === defaultTab.name);
    }, [onChange, defaultTab.name]);
    if (!tabs.find(ii => ii.name === tab)) {
        tab = defaultTab.name;
    }
    return (
        <>
            {tabs.length > 1 && (<Paper square={true} className={classes.root} elevation={0}>
                <MuiTabs value={tab} onChange={handleChange} variant="scrollable"
                      scrollButtons="auto" aria-label="scrollable auto tabs example"
                >
                    {tabs.map(({name, disabled, disabledTooltip, label}) => {
                        const isDisabled = (disabled && disabledTooltip);
                        const content = (
                            <Tab {...(!isDisabled ? {key: name} : {})} value={name} id={`wrapped-tab-${name}`}
                                 label={label || name}
                                 aria-controls={`wrapped-tabpanel-${name}`}
                                 disabled={disabled}
                            />
                        );
                        return isDisabled
                            ? (
                                <Tooltip key={name} title={disabledTooltip}><RawSpan>{content}</RawSpan></Tooltip>
                            ) : content;
                    })}
                </MuiTabs>
            </Paper>)}
            {tabs.map(({name, component: Component, props = {}}) => (
                <Paper square={true} elevation={0} key={name}>
                    <Typography
                        component="div"
                        role="tabpanel"
                        hidden={tab !== name}
                        id={`wrapped-tabpanel-${name}`}
                        aria-labelledby={`wrapped-tab-${name}`}
                    >
                        <Box p={(true === padding) ? 3 : (!padding ? 0 : parseInt(padding))}>
                            {((tab === name) || !optimize) && <Component tabName={name} opened={tab === name} {...extraProps} {...props} />}
                        </Box>
                    </Typography>
                </Paper>
            ))}
        </>
    );
}, undefined, {i18n: false});

export interface TabsProps {
    classes?: {[key: string]: any},
    optimize?: boolean,
    padding?: boolean,
    tabs?: any[],
    tab?: any,
    onChange?: any,
    extraProps?: {[key: string]: any},
}

export default Tabs
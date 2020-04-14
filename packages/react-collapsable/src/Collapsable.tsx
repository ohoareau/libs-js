import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CollapsablePanel from './CollapsablePanel';
import CollapsablePanelSummary from './CollapsablePanelSummary';
import CollapsablePanelDetails from './CollapsablePanelDetails';

const Collapsable = component<CollapsableProps>({
    details: {
        flex: 1,
    },
    checkbox: {
    },
}, ({classes = {}, id, checkable = false, title, variant, defaultExpanded = true, children, summaryClassName, summaryStyle, className, style}: CollapsableProps) => (
    <div style={style}>
        <CollapsablePanel elevation={0} square defaultExpanded={defaultExpanded} className={className}>
            <CollapsablePanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${id}-content`}
                id={`${id}-header`}
                className={summaryClassName}
                style={summaryStyle}
                variant={variant}
            >
                {checkable && (
                    <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={event => event.stopPropagation()}
                        onFocus={event => event.stopPropagation()}
                        control={<Checkbox className={classes.checkbox} />}
                        label={title}
                        style={{width: '100%'}}
                    />
                )}
                {!checkable && (
                    <Typography variant={'h6'}>
                        {title}
                    </Typography>
                )}
            </CollapsablePanelSummary>
            <CollapsablePanelDetails>
                <div className={classes.details}>
                    {children}
                </div>
            </CollapsablePanelDetails>
        </CollapsablePanel>
    </div>
), undefined, {i18n: false});

export type CollapsableProps = {
    classes?: {[key: string]: any},
    id?: string,
    checkable?: boolean,
    title?: string,
    variant?: string,
    defaultExpanded?: boolean,
    children?: any,
    summaryClassName?: string,
    summaryStyle?: any,
    className?: string,
    style?: any,
};

export default Collapsable
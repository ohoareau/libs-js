import React, {ComponentType} from 'react';
import {Selector} from '@ohoareau/react-selector';
import withStyles from '@material-ui/core/styles/withStyles';
import NavigatorItem from './NavigatorItem';

const Navigator: ComponentType<NavigatorProps> = withStyles(() => ({
    root: {
        padding: 10,
    }
}))(({fragments = [], current, onChange, classes = {}}: NavigatorProps) => (
    <div className={classes.root}>
        <Selector items={fragments} value={current} space={2} component={NavigatorItem} onChange={onChange} />
    </div>
));

export interface NavigatorProps {
    fragments?: {id: string, [key: string]: any}[],
    current?: any,
    onChange?: any,
    classes?: {[key: string]: any},
}

export default Navigator
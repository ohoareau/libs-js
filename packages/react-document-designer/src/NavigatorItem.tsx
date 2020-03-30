import React, {ComponentType} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const NavigatorItem: ComponentType<NavigatorItemProps> = withStyles(() => ({
    root: {
        padding: 2,
        margin: 5,
        fontWeight: props => props['changed'] ? 'bold' : 'unset',
    },
}))(({item, classes = {}}: NavigatorItemProps) => (
    <div className={classes.root}>{item.name || item.id}</div>
));

export interface NavigatorItemProps {
    item: {id: string, name: string, [key: string]: any},
    classes?: {[key: string]: any},
}

export default NavigatorItem
import React, {useCallback} from 'react';
import Box from '@material-ui/core/Box';
import component from '@ohoareau/react-component';
import TicketObject from './TicketObject';

export const Ticket = component<TicketProps>({
    root: {
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 500,
        backgroundColor: props => {
            const bg = props.model.getBackground();
            return bg ? bg.color : 'white';
        },
    },
    container: {
        boxSizing: 'border-box',
        flex: 1,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
}, ({classes = {}, model, containerRef, containerNode, svgComponent}: TicketProps) => {
    const onClick = useCallback(() => {
        model.unselectAllObjects();
    }, [model]);
    return (
        <Box className={classes.root}>
            <div className={classes.container} ref={containerRef} onClick={onClick}>
                {model.getObjects().map(o => (
                    <TicketObject key={o.id}
                                  containerNode={containerNode}
                                  object={o}
                                  onToggleSelect={e => {e.stopPropagation(); model[o.selected ? 'unselectObject' : 'selectObject'](o.id);}}
                                  onToggleFocus={e => {e.stopPropagation(); model[o.focused ? 'unfocusObject' : 'focusObject'](o.id);}}
                                  svgComponent={svgComponent}
                    />
                ))}
            </div>
        </Box>
    );
});

export interface TicketProps {
    classes?: any,
    model?: any,
    containerRef: any,
    containerNode: any,
    svgComponent: any,
}

export default Ticket
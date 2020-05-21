import React from 'react';
import Box from '@material-ui/core/Box';
import component from '@ohoareau/react-component';
import TicketObject from './TicketObject';
import {model} from './types';

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
}, ({classes = {}, model, containerRef, containerNode, svgComponent}: TicketProps) => (
    <Box className={classes.root}>
        <div className={classes.container} ref={containerRef} onClick={model.clickBackground}>
            {model.mapObjects(o => (
                <TicketObject key={o.id}
                              containerNode={containerNode}
                              object={o}
                              onClick={model.clickObject}
                              onMouseEnter={model.mouseEnterObject}
                              onMouseLeave={model.mouseLeaveObject}
                              onDragStart={model.startDraggingObject}
                              onDragEnd={model.stopDraggingObject}
                              onResizeStart={model.startResizingObject}
                              onResizeEnd={model.stopResizingObject}
                              onRotateStart={model.startRotatingObject}
                              onRotateEnd={model.stopRotatingObject}
                              svgComponent={svgComponent}
                />
            ))}
        </div>
    </Box>
));

export interface TicketProps {
    classes?: any,
    model: model,
    containerRef: any,
    containerNode: any,
    svgComponent: any,
}

export default Ticket
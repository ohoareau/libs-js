import React, {useEffect, useRef, useState} from 'react';
import Box from '@material-ui/core/Box';
import Ticket from './Ticket';
import component from '@ohoareau/react-component';
import {model} from './types';
import {SidePanel} from './SidePanel';

export const DrawZone = component<DrawZoneProps>({
    root: {
        boxSizing: 'border-box',
        backgroundColor: 'rgb(225, 225, 225)',
        height: '100%',
    }
}, ({classes = {}, model, svgComponent}: DrawZoneProps) => {
    const containerRef = useRef(null);
    const [container, setContainer] = useState();
    useEffect(() => {
        setContainer(containerRef.current as any);
    }, []);
    return (
        <Box className={classes.root} p={5}>
            <div style={{display: 'flex'}}>
                <div style={{flex: 3, position: 'relative', width: '100%'}}>
                    <Ticket model={model} containerRef={containerRef} containerNode={container} svgComponent={svgComponent} />
                </div>
                <div style={{flex: 1}}>
                    <SidePanel model={model} />
                </div>
            </div>
        </Box>
    );
});

export interface DrawZoneProps {
    classes?: any,
    model: model,
    svgComponent: any,
}

export default DrawZone
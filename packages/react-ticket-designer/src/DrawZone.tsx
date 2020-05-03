import React, {useEffect, useRef, useState} from 'react';
import Box from '@material-ui/core/Box';
import Ticket from './Ticket';
import component from '@ohoareau/react-component';

export const DrawZone = component<DrawZoneProps>({
    root: {
        boxSizing: 'border-box',
        backgroundColor: 'rgb(225, 225, 225)',
        height: '100%',
    }
}, ({classes = {}, model = {}, svgComponent}: DrawZoneProps) => {
    const containerRef = useRef(null);
    const [container, setContainer] = useState();
    useEffect(() => {
        setContainer(containerRef.current as any);
    }, []);
    return (
        <Box className={classes.root} p={5}>
            <Ticket model={model} containerRef={containerRef} containerNode={container} svgComponent={svgComponent} />
        </Box>
    );
});

export interface DrawZoneProps {
    classes?: any,
    model?: any,
    svgComponent: any,
}

export default DrawZone
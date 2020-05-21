import React, {useCallback, useEffect, useRef, useState} from 'react';
import ObjectsPrimitives from './ObjectsPrimitives';
import component from '@ohoareau/react-component';
import * as objectTypes from './objects';
import {modelObject} from './types';

export const TicketObject = component<TicketObjectProps>(undefined, ({onClick, onMouseEnter, onMouseLeave, onDragStart, onDragEnd, onResizeStart, onResizeEnd, onRotateStart, onRotateEnd, object, containerNode, svgComponent}: TicketObjectProps) => {
    const id = object.id;
    const ref = useRef(null as any);
    const [renderMovable, setRenderMovable] = useState(undefined as any);
    const Component = objectTypes[object.type] || null;
    const handleMouseEnter = useCallback(e => {
        e.stopPropagation();
        onMouseEnter(id);
    }, [id, onMouseEnter]);
    const handleMouseLeave = useCallback(e => {
        e.stopPropagation();
        onMouseLeave(id);
    }, [id, onMouseLeave]);
    const handleDragStart = useCallback(() => {
        onDragStart(id);
    }, [id, onDragStart]);
    const handleDragEnd = useCallback(info => {
        onDragEnd(id, info);
    }, [id, onDragEnd]);
    const handleResizeStart = useCallback(() => {
        onResizeStart(id);
    }, [id, onResizeStart]);
    const handleResizeEnd = useCallback(info => {
        onResizeEnd(id, info);
    }, [id, onResizeEnd]);
    const handleRotateStart = useCallback(() => {
        onRotateStart(id);
    }, [id, onRotateStart]);
    const handleRotateEnd = useCallback(info => {
        onRotateEnd(id, info);
    }, [id, onRotateEnd]);
    const handleClick = useCallback(e => {
        e.stopPropagation();
        onClick(id);
    }, [id, onClick]);
    useEffect(() => {
        !object.group && setRenderMovable((object as any).selected ? 'selected' : ((object as any).focused ? 'focused' : undefined));
    }, [object.group, object.selected, object.focused]);
    return Component ? (
        <>
            <Component ref={ref} object={object}
                       svgComponent={svgComponent}
                       onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}
            />
            {!!renderMovable && (
                <ObjectsPrimitives target={ref.current} container={containerNode}
                                   object={object}
                                   onDragStart={handleDragStart} onDragEnd={handleDragEnd}
                                   onResizeStart={handleResizeStart} onResizeEnd={handleResizeEnd}
                                   onRotateStart={handleRotateStart} onRotateEnd={handleRotateEnd}
                />
            )}
        </>
    ) : null;
});

export interface TicketObjectProps {
    object: modelObject,
    containerNode?: any,
    onClick: any,
    onMouseEnter: any,
    onMouseLeave: any,
    onDragStart: any,
    onDragEnd: any,
    onResizeStart: any,
    onResizeEnd: any,
    onRotateStart: any,
    onRotateEnd: any,
    svgComponent: any,
}

export default TicketObject
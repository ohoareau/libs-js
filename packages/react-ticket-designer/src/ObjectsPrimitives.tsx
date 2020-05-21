import React, {ComponentType, useCallback} from 'react';
import Moveable from 'react-moveable';
import {modelObject} from "./types";

export const ObjectsPrimitives: ComponentType<ObjectsPrimitivesProps> = ({onDragStart, onDragEnd, onResizeStart, onResizeEnd, onRotateStart, onRotateEnd, target, container, object}: ObjectsPrimitivesProps) => {
    const handleDragStart = useCallback(({ inputEvent, target, clientX, clientY }) => {
        inputEvent.stopPropagation();
        onDragStart();
    }, [object, onDragStart]);
    const handleDrag = useCallback(({
                                        inputEvent, target,
                                        beforeDelta, beforeDist,
                                        left, top,
                                        right, bottom,
                                        delta, dist,
                                        transform,
                                        clientX, clientY,
                                    }) => {
        inputEvent.stopPropagation();
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
    }, [object]);
    const handleDragGroup = useCallback(({targets, events}) => {
        events.forEach(ev => {
            ev.target.style.left = `${ev.left}px`;
            ev.target.style.top = `${ev.top}px`;
            ev.target.style.transform = ev.transform;
            ev.stopPropagation();
        })
    }, [object]);
    const handleDragEnd = useCallback(({ inputEvent, ...event }) => {
        inputEvent.stopPropagation();
        onDragEnd({
            x: event.target.style.left,
            y: event.target.style.top,
            width: event.target.style.width,
            height: event.target.style.height,
            transform: event.target.style.transform,
            data: event.datas || {},
        });
    }, [object, onDragEnd]);
    const handleResizeStart = useCallback(({ inputEvent, target , clientX, clientY}) => {
        inputEvent.stopPropagation();
        onResizeStart();
    }, [object, onResizeStart]);
    const handleResize = useCallback(({
                                          inputEvent, target, width, height,
                                          dist, delta, direction,
                                          clientX, clientY
                                      }) => {
        inputEvent.stopPropagation();
        if (delta[0]) {
            target.style.width = `${width}px`;
            if (direction[0] < 0) {
                target.style.left = `${parseInt(target.style.left) - delta[0]}px`;
            }
        }
        if (delta[1]) {
            target.style.height = `${height}px`;
            if (direction[1] < 0) {
                target.style.top = `${parseInt(target.style.top) - delta[1]}px`;
            }
        }
    }, [object]);
    const handleResizeEnd = useCallback(({ inputEvent, ...event }) => {
        inputEvent.stopPropagation();
        onResizeEnd({
            x: event.target.style.left,
            y: event.target.style.top,
            width: event.target.style.width,
            height: event.target.style.height,
            transform: event.target.style.transform,
            data: event.datas || {},
        });
    }, [object, onResizeEnd]);
    const handleRotateStart = useCallback(({ inputEvent, target, clientX, clientY }) => {
        inputEvent.stopPropagation();
        onRotateStart();
    }, [object, onRotateStart]);
    const handleRotate = useCallback(({
                                          inputEvent, target,
                                          delta, dist,
                                          transform,
                                          clientX, clientY,
                                      }) => {
        inputEvent.stopPropagation();
        target.style.transform = transform;
    }, [object]);
    const handleRotateEnd = useCallback(({ inputEvent, ...event }) => {
        inputEvent.stopPropagation();
        onRotateEnd({
            x: event.target.style.left,
            y: event.target.style.top,
            width: event.target.style.width,
            height: event.target.style.height,
            transform: event.target.style.transform,
            data: event.datas || {},
        });
    }, [object, onRotateEnd]);
    return (
        <Moveable
            target={target}
            container={container}
            draggable={!!(object as any).focused || !!(object as any).selected}
            onDragGroup={handleDragGroup} /* todo handle it */
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            throttleDrag={0}
            resizable={!!(object as any).selected}
            throttleResize={0}
            onResizeStart={handleResizeStart}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
            rotatable={!!(object as any).selected}
            throttleRotate={0}
            onRotateStart={handleRotateStart}
            onRotate={handleRotate}
            onRotateEnd={handleRotateEnd}
            rotationPosition={'bottom'}
                /*
                scalable: true,
                throttleScale: 0,
                onScaleStart: ({ inputEvent, target, clientX, clientY }) => {
                    inputEvent.stopPropagation();
                },
                onScale: ({
                              inputEvent, target, scale, dist, delta, transform,
                              clientX, clientY,
                          }) => {
                    target.style.transform = transform;
                    inputEvent.stopPropagation();
                },
                onScaleEnd: ({ inputEvent, target, isDrag, clientX, clientY }) => {
                    inputEvent.stopPropagation();
                },
                 */
        />
    )
};

export interface ObjectsPrimitivesProps {
    target: any,
    container: any,
    object?: modelObject,
    modes?: any,
    onDragStart: any,
    onDragEnd: any,
    onResizeStart: any,
    onResizeEnd: any,
    onRotateStart: any,
    onRotateEnd: any,
}

export default ObjectsPrimitives
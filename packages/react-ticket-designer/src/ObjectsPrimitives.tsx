import React, {ComponentType} from 'react';
import Moveable from 'react-moveable';

export const ObjectsPrimitives: ComponentType<ObjectsPrimitivesProps> = ({target, container, mode}: ObjectsPrimitivesProps) => {
    let extra = {};
    switch (mode) {
        case 'selected':
            extra = {
                draggable: true,
                onDragStart: ({ inputEvent, target, clientX, clientY }) => {
                    inputEvent.stopPropagation();
                },
                onDrag: ({
                    inputEvent, target,
                    beforeDelta, beforeDist,
                    left, top,
                    right, bottom,
                    delta, dist,
                    transform,
                    clientX, clientY,
                }) => {
                    target.style.left = `${left}px`;
                    target.style.top = `${top}px`;
                    inputEvent.stopPropagation();
                },
                onDragEnd: ({ inputEvent, target, isDrag, clientX, clientY }) => {
                    inputEvent.stopPropagation()
                },
                throttleDrag: 0,
                resizable: true,
                throttleResize: 0,
                onResizeStart: ({ inputEvent, target , clientX, clientY}) => {
                    inputEvent.stopPropagation();
                },
                onResize: ({
                    inputEvent, target, width, height,
                    dist, delta, direction,
                    clientX, clientY
                }) => {
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
                    inputEvent.stopPropagation();
                },
                onResizeEnd: ({ inputEvent, target, isDrag, clientX, clientY, ...extra }) => {
                    inputEvent.stopPropagation();
                },
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
                rotatable: true,
                throttleRotate: 0,
                onRotateStart: ({ target, clientX, clientY }) => {
                },
                onRotate: ({
                    inputEvent, target,
                    delta, dist,
                    transform,
                    clientX, clientY,
                }) => {
                    inputEvent.stopPropagation();
                    target.style.transform = transform;
                },
                onRotateEnd: ({ inputEvent, target, isDrag, clientX, clientY }) => {
                    inputEvent.stopPropagation();
                },
                rotationPosition: 'bottom',
            };
            break;
        case 'focused':
            extra = {
                draggable: true,
                onDragStart: ({ inputEvent, target, clientX, clientY }) => {
                    inputEvent.stopPropagation();
                },
                onDrag: ({
                             inputEvent, target,
                             beforeDelta, beforeDist,
                             left, top,
                             right, bottom,
                             delta, dist,
                             transform,
                             clientX, clientY,
                         }) => {
                    target.style.left = `${left}px`;
                    target.style.top = `${top}px`;
                    inputEvent.stopPropagation();
                },
                onDragEnd: ({ inputEvent, target, isDrag, clientX, clientY }) => {
                    inputEvent.stopPropagation()
                },
                throttleDrag: 0,
            };
            break;
        default:
            break;
    }
    return (
        <Moveable
            target={target}
            container={container}
            {...extra}
        />
    )
};

export interface ObjectsPrimitivesProps {
    target: any,
    container: any,
    mode?: string,
}

export default ObjectsPrimitives
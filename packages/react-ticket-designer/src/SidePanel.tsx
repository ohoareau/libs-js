import component from '@ohoareau/react-component';
import React, {useCallback} from 'react';
import {model} from './types';

const cx = (...xx) => xx.filter(x => !!x).join(' ');

export const SidePanel = component<DebugPanelProps>({
    root: {
        padding: '0 10px 10px 10px',
    },
    modes: {
        display: 'flex',
    },
    mode: {
        backgroundColor: 'rgb(235, 235, 235)',
        flex: 1,
        padding: 5,
        textAlign: 'center',
    },
    modeSelecting: {
        backgroundColor: 'orange',
    },
    modeDragging: {
        backgroundColor: 'pink',
    },
    modeResizing: {
        backgroundColor: 'cyan',
    },
    modeRotating: {
        backgroundColor: 'yellow',
    },
    modeFocusing: {
        backgroundColor: 'lime',
    },
    object: {
        padding: 5,
        marginTop: 5,
        backgroundColor: 'rgb(245, 245, 245)',
    },
    objectSelected: {
        backgroundColor: 'orange',
    },
    objectDragged: {
        backgroundColor: 'pink',
    },
    objectResized: {
        backgroundColor: 'cyan',
    },
    objectRotated: {
        backgroundColor: 'yellow',
    },
    objectFocused: {
        backgroundColor: 'lime',
    },
}, ({classes = {}, model}: DebugPanelProps) => {
    const downloadFile = useCallback(() => {
        const element = document.createElement('a');
        const f = model.getFile();
        const file = new Blob([f.content], {type: f.contentType});
        element.href = URL.createObjectURL(file);
        element.download = f.name;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }, [model]);
    return (
        <div className={classes.root}>
            <div className={classes.modes}>
                <div className={cx(classes.mode, model.isDragging() && classes.modeDragging)} onClick={model.toggleDragging}>DRAG</div>
                <div className={cx(classes.mode, model.isResizing() && classes.modeResizing)} onClick={model.toggleResizing}>RESIZE</div>
                <div className={cx(classes.mode, model.isRotating() && classes.modeRotating)} onClick={model.toggleRotating}>ROTATE</div>
                <div className={cx(classes.mode, model.isSelecting() && classes.modeSelecting)} onClick={model.toggleSelecting}>SELECT</div>
                <div className={cx(classes.mode, model.isFocusing() && classes.modeFocusing)} onClick={model.toggleFocusing}>FOCUS</div>
            </div>
            {model.mapObjects(o => (
                <div key={o.id}
                     className={cx(classes.object, o.dragged && classes.objectDragged, o.selected && classes.objectSelected, o.focused && classes.objectFocused, o.resized && classes.objectResized, o.rotated && classes.objectRotated)}
                     onClick={e => {e.stopPropagation(); model.toggleSelectObject(o.id)}}
                >
                    <div>{o.type.toUpperCase()} ({o.x};{o.y}) {o.width}x{o.height}</div>
                </div>
            ))}
            <div onClick={downloadFile}>SAVE</div>
        </div>
    );
});

export interface DebugPanelProps {
    classes?: any,
    model: model,
}

export default SidePanel
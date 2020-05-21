import {useCallback, useState} from 'react';
import useKey from 'use-key-hook';
import {v4 as uuid} from 'uuid';
import {dataModel, model} from './types';

export const useTicketModel = ({defaultValue, onChange}: {defaultValue?: any, onChange?: any} = {}): model => {
    const [shiftMode, setShiftMode] = useState(false);
    useKey((pressedKey) => (16 === pressedKey) && setShiftMode(true), {detectKeys: [16], keyevent: 'keydown'});
    useKey((pressedKey) => (16 === pressedKey) && setShiftMode(false), {detectKeys: [16], keyevent: 'keyup'});
    useKey((pressedKey) => (8 === pressedKey) && deleteSelected(), {detectKeys: [8], keyevent: 'keyup'});
    const [model, rawSetModel]: [dataModel, Function] = useState(() => {
        return {
            objects: {}, dragging: false, rotating: false, resizing: false, focusing: false, focused: {}, selecting: false, selected: {}, background: undefined as any,
            ...(defaultValue || {})
        } as dataModel;
    });
    const setModel = useCallback(x => {
        rawSetModel(x);
        onChange && onChange(x);
    }, [rawSetModel, onChange]);
    const isDragging = useCallback(() => model.dragging, [model.dragging]);
    const isRotating = useCallback(() => model.rotating, [model.rotating]);
    const isResizing = useCallback(() => model.resizing, [model.resizing]);
    const isSelecting = useCallback(() => model.selecting, [model.selecting]);
    const isFocusing = useCallback(() => model.focusing, [model.focusing]);
    const addObject = useCallback(o => {
        o = {...o, id: uuid()};
        model.objects[o.id] = {...o}; // @todo
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const getObjects = useCallback(() => Object.values(model.objects), [model]);
    const getBackground = useCallback(() => model.background ? {...(model.background as any)} : undefined, [model]);
    const removeObject = useCallback(id => {
        delete model.objects[id];
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const resizeObject = useCallback((id, size, position) => {
        model.objects[id] = {...model.objects[id], size: {...size}, position: {...position}};
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const moveObject = useCallback((id, position) => {
        model.objects[id] = {...model.objects[id], position: {...position}};
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const rotateObject = useCallback((id, position, rotation) => {
        model.objects[id] = {...model.objects[id], rotation: {...rotation}, position: {...position}};
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const unselectAllObjects = useCallback(() => {
        model.objects = Object.entries(model.objects).reduce((acc, [k, v]) => {
            (v as any).selected && (v = {...(v as any), selected: false});
            acc[k] = v;
            return acc;
        }, {});
        setModel({...model, objects: {...model.objects}, selecting: false, selected: {}});
    }, [model, setModel]);
    const unfocusAllObjects = useCallback(() => {
        model.objects = Object.entries(model.objects).reduce((acc, [k, v]) => {
            (v as any).focused && (v = {...(v as any), focused: false});
            acc[k] = v;
            return acc;
        }, {});
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const selectObject = useCallback((id) => {
        if (!shiftMode) {
            model.objects = {...Object.keys(model.selected).reduce((acc, k) => {
                acc[k] = {...acc[k], selected: false};
                return acc;
            }, model.objects)};
            model.selected = {};
        }
        model.objects[id] = {...model.objects[id], selected: true};
        setModel({...model, objects: {...model.objects}, selecting: true, selected: {...model.selected, [id]: true}});
    }, [model, setModel, shiftMode, unselectAllObjects]);
    const focusObject = useCallback((id) => {
        unfocusAllObjects();
        if (model.objects[id].selected) return;
        model.objects[id] = {...model.objects[id], focused: true};
        setModel({...model, objects: {...model.objects}, focusing: true, focused: {...model.focused, [id]: true}});
    }, [model, setModel, unfocusAllObjects]);
    const unselectObject = useCallback((id) => {
        model.objects[id] = {...model.objects[id], selected: false};
        delete model.selected[id];
        model.selecting = !!Object.keys(model.selected || {}).length;
        setModel({...model, objects: {...model.objects}, selected: {...model.selected}});
    }, [model, setModel]);
    const unfocusObject = useCallback((id) => {
        model.objects[id] = {...model.objects[id], focused: false};
        delete model.focused[id];
        model.focusing = !!Object.keys(model.focused || {}).length;
        setModel({...model, objects: {...model.objects}, focused: {...model.focused}});
    }, [model, setModel]);
    const setBackground = useCallback((setting) => {
        setModel({...model, background: {...setting}});
    }, [model, setModel]);
    const mapObjects = useCallback(callback => getObjects().map(callback), [getObjects]);
    const setBackgroundColor = useCallback((color: string) => setBackground({type: 'color', color}), [setBackground]);
    const addTextObject = useCallback((text: string) => addObject({type: 'text', data: {text}}), [addObject]);
    const addImageObject = useCallback((image: string) => addObject({type: 'image', data: {url: image, color: 'orange'}}), [addObject]);
    const addShapeObject = useCallback((type: string, definition?: any) => addObject({type: 'shape', data: {shape: type, ...(definition || {})}}), [addObject]);
    const shapeInfo = useCallback(info => {
        return {
            x: parseInt(info.x.replace(/px$/, '')),
            y: parseInt(info.y.replace(/px$/, '')),
            width: parseInt(info.width.replace(/px$/, '')),
            height: parseInt(info.height.replace(/px$/, '')),
            transform: info.transform,
        };
    }, []);
    const mouseEnterObject = useCallback(id => {
        !isDragging() && focusObject(id);
    }, [model, isDragging, focusObject]);
    const mouseLeaveObject = useCallback(id => {
        !isDragging() && unfocusObject(id);
    }, [model, isDragging, unfocusObject]);
    const startDraggingObject = useCallback(id => {
        model.objects[id] = {...model.objects[id], dragged: true};
        setModel({...model, objects: {...model.objects}, dragged: {...model.dragged, [id]: true}, dragging: true});
    }, [model, setModel]);
    const stopDraggingObject = useCallback((id, info) => {
        model.objects[id] = {...model.objects[id], dragged: false, ...shapeInfo(info)};
        delete model.dragged[id];
        model.dragging = !!Object.keys(model.dragged).length;
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const startResizingObject = useCallback(id => {
        model.objects[id] = {...model.objects[id], resized: true};
        setModel({...model, objects: {...model.objects}, resized: {...model.resized, [id]: true}, resizing: true});
    }, [model, setModel]);
    const stopResizingObject = useCallback((id, info) => {
        model.objects[id] = {...model.objects[id], resized: false, ...shapeInfo(info)};
        delete model.resized[id];
        model.resizing = !!Object.keys(model.resized).length;
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const startRotatingObject = useCallback(id => {
        model.objects[id] = {...model.objects[id], rotated: true};
        setModel({...model, objects: {...model.objects}, rotated: {...model.rotated, [id]: true}, rotating: true});
    }, [model, setModel]);
    const stopRotatingObject = useCallback((id, info) => {
        model.objects[id] = {...model.objects[id], rotated: false, ...shapeInfo(info)};
        delete model.rotated[id];
        model.rotating = !!Object.keys(model.rotated).length;
        setModel({...model, objects: {...model.objects}});
    }, [model, setModel]);
    const deleteSelected = useCallback(() => {
        Object.keys(model.selected || {}).forEach(x => {
            delete model.objects[x];
            delete model.focused[x];
            delete model.resized[x];
            delete model.rotated[x];
            delete model.selected[x];
        });
        model.selected = {...model.selected};
        model.focused = {...model.focused};
        model.resized = {...model.resized};
        model.rotated = {...model.rotated};
        model.selecting = !!Object.keys(model.selected).length;
        model.rotating = !!Object.keys(model.rotated).length;
        model.focusing = !!Object.keys(model.focused).length;
        model.resizing = !!Object.keys(model.resized).length;
        model.objects = {...model.objects};
        setModel({...model});
    }, [model, setModel]);
    const toggleDragging = useCallback(e => {
        e.stopPropagation();
        if (model.dragging) {
            model.objects = {...Object.keys(model.dragged).reduce((acc, k) => {
                acc[k] = {...acc[k], dragged: false};
                return acc;
            }, model.objects)};
            setModel({...model, dragging: false, dragged: {}});
        } else if (model.selecting) {
            model.objects = {...Object.keys(model.selected).reduce((acc, k) => {
                    acc[k] = {...acc[k], dragged: true};
                    return acc;
                }, model.objects)};
            setModel({...model, dragging: true, dragged: {...model.selected}});
        }
    }, [model]);
    const toggleResizing = useCallback(e => {
        if (model.resizing) {
            model.objects = {...Object.keys(model.resized).reduce((acc, k) => {
                    acc[k] = {...acc[k], resized: false};
                    return acc;
                }, model.objects)};
            setModel({...model, resizing: false, resized: {}});
        } else if (model.selecting) {
            model.objects = {...Object.keys(model.selected).reduce((acc, k) => {
                    acc[k] = {...acc[k], resized: true};
                    return acc;
                }, model.objects)};
            setModel({...model, resizing: true, resized: {...model.selected}});
        }
    }, [model]);
    const toggleRotating = useCallback(e => {
        if (model.rotating) {
            model.objects = {...Object.keys(model.rotated).reduce((acc, k) => {
                    acc[k] = {...acc[k], rotated: false};
                    return acc;
                }, model.objects)};
            setModel({...model, rotating: false, rotated: {}});
        } else if (model.selecting) {
            model.objects = {...Object.keys(model.selected).reduce((acc, k) => {
                    acc[k] = {...acc[k], rotated: true};
                    return acc;
                }, model.objects)};
            setModel({...model, rotating: true, rotated: {...model.selected}});
        }
    }, [model]);
    const toggleFocusing = useCallback(e => {
        if (model.focusing) {
            model.objects = {...Object.keys(model.focused).reduce((acc, k) => {
                    acc[k] = {...acc[k], focused: false};
                    return acc;
                }, model.objects)};
            setModel({...model, focusing: false, focused: {}});
        }
    }, [model]);
    const toggleSelecting = useCallback(e => {
        if (model.selecting) {
            model.objects = {...Object.keys(model.selected).reduce((acc, k) => {
                    acc[k] = {...acc[k], selected: false};
                    return acc;
                }, model.objects)};
            setModel({...model, selecting: false, selected: {}});
        }
    }, [model]);
    const toggleSelectObject = useCallback(id => {
        if (model.selected && model.selected[id]) {
            unselectObject(id);
        } else {
            selectObject(id);
        }
    }, [unselectObject, selectObject, model])
    const clickObject = useCallback(id => {
        !isDragging() && selectObject(id);
    }, [model, isDragging, selectObject]);
    const clickBackground = useCallback(() => {
        !isDragging() && !isRotating() && !isResizing() && unselectAllObjects();
    }, [model, unselectAllObjects]);
    const getFile = () => {
        const d = {
            format: 'ticket-format',
            version: '1.0',
            content: {
                objects: Object.entries(model.objects).reduce((acc, [k, v]) => {
                    const {id, type, group, data, x, y, width, height, transform} = v;
                    acc[k] = {id, type, group, data, x, y, width, height, transform};
                    return acc;
                }, {} as any),
            }
        };
        return {
            name: 'ticket.json',
            contentType: 'application/json',
            content: JSON.stringify(d, null, 2),
        };
    }
    return <model>{
        clickBackground, mouseEnterObject, mouseLeaveObject, clickObject, mapObjects,
        isDragging, isResizing, isRotating, isSelecting, isFocusing,
        startDraggingObject, stopDraggingObject, startResizingObject, stopResizingObject,
        startRotatingObject, stopRotatingObject,
        addObject, removeObject, resizeObject, moveObject, rotateObject, getObjects, selectObject,
        addTextObject, addImageObject, addShapeObject,
        unselectObject, unselectAllObjects, getBackground, setBackground, focusObject, unfocusObject,
        unfocusAllObjects, setBackgroundColor, toggleDragging, toggleFocusing, toggleResizing, toggleRotating,
        toggleSelecting, toggleSelectObject, getFile,
    };
};


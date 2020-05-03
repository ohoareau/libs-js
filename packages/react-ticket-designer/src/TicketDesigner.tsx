import React, {useState, useCallback} from 'react';
import Header from './Header';
import Footer from './Footer';
import useKey from 'use-key-hook';
import DrawZone from './DrawZone';
import LeftToolbar from './LeftToolbar';
import {v4 as uuid} from 'uuid';
import component from "@ohoareau/react-component";

const useTicketModel = () => {
    const [shiftMode, setShiftMode] = useState(false);
    useKey((pressedKey) => {
        16 === pressedKey && setShiftMode(true);
    }, {
        detectKeys: [16],
        keyevent: 'keydown',
    });
    useKey((pressedKey) => {
        16 === pressedKey && setShiftMode(false);
    }, {
        detectKeys: [16],
        keyevent: 'keyup',
    });
    const [model, setModel] = useState({objects: {}, background: undefined});
    const updateObjects = useCallback(objects => {
        setModel({...model, objects: {...objects}});
    }, [model, setModel]);
    const addObject = useCallback(o => {
        o = {...o, id: uuid()};
        model.objects[o.id] = {...o}; // @todo
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const getObjects = useCallback(() => Object.values(model.objects), [model]);
    const getBackground = useCallback(() => model.background ? {...(model.background as any)} : undefined, [model]);
    const removeObject = useCallback(id => {
        delete model.objects[id];
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const resizeObject = useCallback((id, size, position) => {
        model.objects[id] = {...model.objects[id], size: {...size}, position: {...position}};
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const moveObject = useCallback((id, position) => {
        model.objects[id] = {...model.objects[id], position: {...position}};
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const rotateObject = useCallback((id, position, rotation) => {
        model.objects[id] = {...model.objects[id], rotation: {...rotation}, position: {...position}};
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const unselectAllObjects = useCallback(() => {
        model.objects = Object.entries(model.objects).reduce((acc, [k, v]) => {
            (v as any).selected && (v = {...(v as any), selected: false});
            acc[k] = v;
            return acc;
        }, {});
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const unfocusAllObjects = useCallback(() => {
        model.objects = Object.entries(model.objects).reduce((acc, [k, v]) => {
            (v as any).focused && (v = {...(v as any), focused: false});
            acc[k] = v;
            return acc;
        }, {});
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const selectObject = useCallback((id) => {
        !shiftMode && unselectAllObjects();
        model.objects[id] = {...model.objects[id], selected: true};
        updateObjects(model.objects);
    }, [model, updateObjects, shiftMode, unselectAllObjects]);
    const focusObject = useCallback((id) => {
        unfocusAllObjects();
        if (model.objects[id].selected) return;
        model.objects[id] = {...model.objects[id], focused: true};
        updateObjects(model.objects);
    }, [model, updateObjects, unfocusAllObjects]);
    const unselectObject = useCallback((id) => {
        model.objects[id] = {...model.objects[id], selected: false};
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const unfocusObject = useCallback((id) => {
        model.objects[id] = {...model.objects[id], focused: false};
        updateObjects(model.objects);
    }, [model, updateObjects]);
    const setBackground = useCallback((setting) => {
        setModel({...model, background: {...setting}});
    }, [model, setModel]);
    return {addObject, removeObject, resizeObject, moveObject, rotateObject, getObjects, selectObject, unselectObject, unselectAllObjects, getBackground, setBackground, focusObject, unfocusObject, unfocusAllObjects};
};

const TicketDesigner = component<TicketDesignerProps>({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
    },
    footer: {
    },
    container: {
        flex: 1,
        display: 'flex',
    },
    leftToolbar: {
        display: 'flex',
    },
    drawZone: {
        flex: 1,
    },
}, ({classes = {}, svgComponent}: TicketDesignerProps) => {
    const model = useTicketModel();
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Header model={model} />
            </div>
            <div className={classes.container}>
                <div className={classes.leftToolbar}>
                    <LeftToolbar model={model} />
                </div>
                <div className={classes.drawZone}>
                    <DrawZone model={model} svgComponent={svgComponent} />
                </div>
            </div>
            <div className={classes.footer}>
                <Footer />
            </div>
        </div>
    );
});

export interface TicketDesignerProps {
    classes?: any,
    svgComponent: any,
}

export default TicketDesigner
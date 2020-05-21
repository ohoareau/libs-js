import React, {useCallback, useState} from 'react';
import Box from '@material-ui/core/Box';
import Tool from './Tool';
import Modal from '@ohoareau/react-modal';
import {model} from './types';
import component from '@ohoareau/react-component';

export const LeftToolbar = component<LeftToolbarProps>({
    root: {
        backgroundColor: '#C6DABF',
        boxSizing: 'border-box',
    }
}, ({classes = {}, model}: LeftToolbarProps) => {
    const [modal, setModal] = useState(undefined as any);
    const tools = [
        {id: 'text', onAdd: useCallback(() => {
            model.unselectAllObjects();
            setModal({
                name: 'add_text',
                children: (
                    <div>
                        <button onClick={() => {model.addTextObject('test 1'); setModal(undefined);}}>test 1</button>
                        <button onClick={() => {model.addTextObject('test 2'); setModal(undefined);}}>test 2</button>
                        <button onClick={() => {model.addTextObject('test 3'); setModal(undefined);}}>test 3</button>
                    </div>
                )
            });
        }, [setModal, model])},
        {id: 'image', onAdd: useCallback(() => {
            model.unselectAllObjects();
            setModal({
                name: 'add_image',
                children: (
                    <div>
                        <button onClick={() => {model.addImageObject('http://dtu13-3.com/bundles/amotpl/themes/bottom-line/images/logo.png'); setModal(undefined);}}>AMOCER</button>
                    </div>
                )
            });
        }, [setModal, model])},
        {id: 'shape', onAdd: useCallback(() => {
            model.unselectAllObjects();
            setModal({
                name: 'add_shape',
                children: (
                    <div>
                        <button onClick={() => {model.addShapeObject('rectangle', {color: 'cyan'}); setModal(undefined);}}>Rectangle</button>
                        <button onClick={() => {model.addShapeObject('circle', {color: 'red'}); setModal(undefined);}}>Circle</button>
                        <button onClick={() => {model.addShapeObject('square', {color: 'brown'}); setModal(undefined);}}>Square</button>
                        <button onClick={() => {model.addShapeObject('line', {color: 'green'}); setModal(undefined);}}>Line</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0001', color: 'green'}); setModal(undefined);}}>O0001</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0002', color: 'green'}); setModal(undefined);}}>O0002</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0003', color: 'green'}); setModal(undefined);}}>O0003</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0004', color: 'green'}); setModal(undefined);}}>O0004</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0005', color: 'green'}); setModal(undefined);}}>O0005</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0006', color: 'green'}); setModal(undefined);}}>O0006</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0007', color: 'green'}); setModal(undefined);}}>O0007</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0008', color: 'green'}); setModal(undefined);}}>O0008</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0009', color: 'green'}); setModal(undefined);}}>O0009</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0010', color: 'green'}); setModal(undefined);}}>O0010</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0011', color: 'green'}); setModal(undefined);}}>O0011</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0012', color: 'green'}); setModal(undefined);}}>O0012</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0013', color: 'green'}); setModal(undefined);}}>O0013</button>
                        <button onClick={() => {model.addShapeObject('svg-file', {name: 'o0014', color: 'green'}); setModal(undefined);}}>O0014</button>
                    </div>
                )
            });
        }, [setModal, model])},
    ];
    return (
        <Box className={classes.root} p={2}>
            {tools.map(tool => <Tool key={tool.id} tool={tool} onClick={tool.onAdd} />)}
            {!!modal && (
                <Modal open={true} {...modal} onClose={() => setModal(undefined)} onCancel={() => setModal(undefined)} cancelLabel={'Annuler'}/>
            )}
        </Box>
    );
});

export interface LeftToolbarProps {
    classes?: any,
    model: model,
}

export default LeftToolbar
import React, {useCallback, useState} from 'react';
import Box from '@material-ui/core/Box';
import Modal from '@ohoareau/react-modal';
import component from '@ohoareau/react-component';
import Customization from './Customization';
import {model} from './types';

export const Header = component<HeaderProps>({
    root: {
        height: 75,
        backgroundColor: '#1A936F',
        color: 'white',
        boxSizing: 'border-box',
        display: 'flex',
    },
    customizations: {
        marginLeft: 64,
        display: 'flex',
    }
}, ({classes = {}, model}: HeaderProps) => {
    const [modal, setModal] = useState(undefined as any);
    const customizations = [
        {id: 'template'},
        {id: 'format'},
        {id: 'ambiance'},
        {id: 'background', onClick: useCallback(() => {
                model.unselectAllObjects();
                setModal({
                    name: 'set_background',
                    children: (
                        <div>
                            <button onClick={() => {model.setBackgroundColor('white'); setModal(undefined);}}>white</button>
                            <button onClick={() => {model.setBackgroundColor('red'); setModal(undefined);}}>red</button>
                            <button onClick={() => {model.setBackgroundColor('blue'); setModal(undefined);}}>blue</button>
                            <button onClick={() => {model.setBackgroundColor('green'); setModal(undefined);}}>green</button>
                            <button onClick={() => {model.setBackgroundColor('black'); setModal(undefined);}}>black</button>
                            <button onClick={() => {model.setBackgroundColor('cyan'); setModal(undefined);}}>cyan</button>
                            <button onClick={() => {model.setBackgroundColor('pink'); setModal(undefined);}}>pink</button>
                            <button onClick={() => {model.setBackgroundColor('orange'); setModal(undefined);}}>orange</button>
                        </div>
                    )
                });
            }, [setModal, model])}
    ];
    return (
        <Box className={classes.root} p={2}>
            HEADER
            <Box className={classes.customizations}>
                {customizations.map(customization => <Customization key={customization.id} customization={customization} />)}
                {!!modal && (
                    <Modal open={true} {...modal} onClose={() => setModal(undefined)} onCancel={() => setModal(undefined)} cancelLabel={'Annuler'}/>
                )}
            </Box>
        </Box>
    );
});

export interface HeaderProps {
    classes?: any,
    model: model,
}

export default Header
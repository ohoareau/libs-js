import React from 'react';
import Header from './Header';
import Footer from './Footer';
import DrawZone from './DrawZone';
import component from '@ohoareau/react-component';
import LeftToolbar from './LeftToolbar';
import {useTicketModel} from './hooks';

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
}, ({classes = {}, svgComponent, defaultValue, onChange}: TicketDesignerProps) => {
    const model = useTicketModel({defaultValue, onChange});
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
    defaultValue?: any,
    onChange?: any,
    svgComponent: any,
}

export default TicketDesigner
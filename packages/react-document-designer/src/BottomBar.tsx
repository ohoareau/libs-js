import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';

export const BottomBar = component<BottomBarProps>({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 52,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderTop: '1px solid rgb(225, 225, 225)',
    },
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15,
        color: 'rgb(145, 145, 145)',
    },
    icon: {
        marginRight: 5,
    },
    text: {
        flex: 1,
    },
}, ({classes = {}}: BottomBarProps) => (
    <div className={classes.root}>
        <div className={classes.container}>
            <InfoIcon className={classes.icon}/>
            <Typography className={classes.text}>
                Vos modifications sont sauvegardées automatiquement.
            </Typography>
        </div>
    </div>
));

export interface BottomBarProps {
    classes?: any,
}

export default BottomBar
import React from 'react';
import Card from '@material-ui/core/Card';
import CheckIcon from '@material-ui/icons/Check';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

const ModuleBox = component<ModuleBoxProps>({
    root: {
        position: 'relative',
    },
    cardActivated: {
        width: 174,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f50057',
        border: '2px solid #f50057',
        color: 'white',
        '&:hover': {
            cursor: 'pointer',
            border: '2px solid #6E0037',
        }
    },
    cardNotActivated: {
        width: 174,
        margin: 5,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        border: '2px solid rgb(205, 205, 205)',
        '&:hover': {
            cursor: 'pointer',
            border: '2px solid #f50057',
        }
    },
    content: {
        flexGrow: 1,
    },
    check: {
        position: 'absolute',
        bottom: 10,
        right: 20,
    },
}, ({classes = {}, onClick, name, version, selected = false}: ModuleBoxProps) => (
    <div className={classes.root}>
        <Card elevation={0} square onClick={onClick} className={selected ? classes.cardActivated : classes.cardNotActivated}>
            <CardContent className={classes.content}>
                <Typography variant="h5" component="h2">
                    {(name || '?').toUpperCase()}
                </Typography>
                <Typography variant="h6" component="h2">
                    {version ? version.toUpperCase() : ''}
                </Typography>
                {selected && <div className={classes.check}><CheckIcon fontSize={'large'} color={'inherit'} /></div>}
            </CardContent>
        </Card>
    </div>
));

export interface ModuleBoxProps {
    onClick?: any,
    name: string,
    version: string,
    selected?: boolean,
    classes?: {[key: string]: any},
}

export default ModuleBox
import React from 'react';
import {Button} from '@ohoareau/react-button';
import ListIcon from '@material-ui/icons/List';
import component from '@ohoareau/react-component';
import CreateIcon from '@material-ui/icons/Create';
import VisibilityIcon from '@material-ui/icons/Visibility';

const ModeSelector = component<ModeSelectorProps>({
    button: {
        marginLeft: 5,
    },
}, ({classes = {}, value = {}, onChange}: ModeSelectorProps) => (
    <div>
        <Button startIcon={<ListIcon />} className={classes.button} variant={'contained'}
                color={value.navigation ? 'secondary' : 'primary'} label={'Navigation'}
                onClick={() => onChange({...value, navigation: !value.navigation})} />
        <Button startIcon={<VisibilityIcon />} className={classes.button} variant={'contained'}
                color={value.preview ? 'secondary' : 'primary'} label={'Aperçu'}
                onClick={() => onChange({...value, preview: !value.preview})} />
        <Button startIcon={<CreateIcon />} className={classes.button} variant={'contained'}
                color={value.design ? 'secondary' : 'primary'} label={'Edition'}
                onClick={() => onChange({...value, design: !value.design})} />
    </div>
));

export interface ModeSelectorProps {
    classes?: any,
    value?: any,
    onChange?: any,
}

export default ModeSelector
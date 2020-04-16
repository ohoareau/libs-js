import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';
import MenuSelector from './MenuSelector';
import {prepareSelectorItems} from "./utils";

export const Selectors = component({
    root: {
        color: 'white',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
    },
}, ({classes = {}, choices = {}, value = {}, onChange = {}}: SelectorsProps) => {
    const setTemplate = useCallback(template => onChange({...value, template}), [value, onChange]);
    const setTheme = useCallback(theme => onChange({...value, theme}), [value, onChange]);
    const setFontset = useCallback(fontset => onChange({...value, fontset}), [value, onChange]);
    const setFontsize = useCallback(fontsize => onChange({...value, fontsize}), [value, onChange]);
    const setFormat = useCallback(format => onChange({...value, format}), [value, onChange]);
    return (
        <div className={classes.root}>
            <MenuSelector items={prepareSelectorItems(choices.templates)} current={value.template} onChange={setTemplate} label={'Modèle'} />
            <MenuSelector items={prepareSelectorItems(choices.themes)} current={value.theme} onChange={setTheme} label={'Ambiance'} />
            <MenuSelector items={prepareSelectorItems(choices.fontsets)} current={value.fontset} onChange={setFontset} label={'Style Ecriture'} />
            <MenuSelector items={prepareSelectorItems(choices.fontsizes)} current={value.fontsize} onChange={setFontsize} label={'Taille Ecriture'} />
            <MenuSelector items={prepareSelectorItems(choices.formats)} current={value.format} onChange={setFormat} label={'Format'} />
        </div>
    )
});

export interface SelectorsProps {
    classes?: any,
    choices?: {[key: string]: any},
    value?: {[key: string]: any},
    onChange?: any,
}

export default Selectors
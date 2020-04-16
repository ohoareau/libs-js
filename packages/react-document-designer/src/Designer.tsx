import React, {useMemo, useState} from 'react';
import TopBar from './TopBar';
import WorkBench from './WorkBench';
import BottomBar from './BottomBar';
import component from '@ohoareau/react-component';
import {buildStylesheet, prepareDoc, getSelectionTypeNames, prepareFragments, prepareSuggestions} from './utils';

const useSelection = ({templates, themes, fontsets, fontsizes, formats}) => {
    const names = useMemo(() => ({
        templates: getSelectionTypeNames(templates),
        themes: getSelectionTypeNames(themes),
        fontsets: getSelectionTypeNames(fontsets),
        fontsizes: getSelectionTypeNames(fontsizes),
        formats: getSelectionTypeNames(formats),
    }), [themes, fontsets, fontsizes, formats, templates]);
    const choices = useMemo(
        () =>({templates, themes, fontsets, fontsizes, formats}),
        [templates, themes, fontsets, fontsizes, formats]
    );
    const [selectionNames, setSelectionNames]: [any, any] = useState({
        template: names.templates.length ? (names.templates.find(s => !!templates[s]['default']) || names.templates[0]) : undefined,
        theme: names.themes.length ? (names.themes.find(s => !!themes[s]['default']) || names.themes[0]) : undefined,
        fontset: names.fontsets.length ? (names.fontsets.find(s => !!fontsets[s]['default']) || names.fontsets[0]) : undefined,
        fontsize: names.fontsizes.length ? (names.fontsizes.find(s => !!fontsizes[s]['default']) || names.fontsizes[0]) : undefined,
        format: names.formats.length ? (names.formats.find(s => !!formats[s]['default']) || names.formats[0]) : undefined,
    });
    const selection = useMemo(() => ({
        template: templates[selectionNames.template],
        theme: buildStylesheet(selectionNames.theme, themes),
        fontset: buildStylesheet(selectionNames.fontset, fontsets),
        fontsize: buildStylesheet(selectionNames.fontsize, fontsizes),
        format: buildStylesheet(selectionNames.format, formats),
    }), [selectionNames]);
    return {names, choices, selectionNames, setSelectionNames, selection};
};

const Designer = component<DesignerProps>({
    root: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    top: {
        display: 'flex',
    },
    content: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    bottom: {
        display: 'flex',
    },
}, ({classes = {}, model, templates = {}, themes = {}, fontsets = {}, fontsizes = {}, formats = {}, value: config, onChange}: DesignerProps) => {
    const [modes, setModes] = useState({preview: true, navigation: true});
    const {choices, selectionNames, setSelectionNames, selection} = useSelection({templates, themes, fontsets, fontsizes, formats});
    const fragments = prepareFragments(selection.template, config, model);
    const suggestions = useMemo(() => prepareSuggestions(selection.template), [selection.template]);
    const [current, setCurrent]: [any, any] = useState((fragments[0] || {}).id);
    const doc = prepareDoc({fragments, current, config, model, selection, suggestions});
    return (
        <div className={classes.root}>
            <div className={classes.top}>
                <TopBar doc={doc} fragments={fragments} modes={modes} choices={choices} selection={selectionNames} onChangeModes={setModes} onChangeSelection={setSelectionNames} />
            </div>
            <div className={classes.content}>
                <WorkBench doc={doc} fragments={fragments} modes={modes} current={current} setCurrent={setCurrent} onChange={onChange} />
            </div>
            <div className={classes.bottom}>
                <BottomBar />
            </div>
        </div>
    );
}, undefined, {i18n: false});

export interface DesignerProps {
    classes?: any,
    model?: any,
    templates?: any,
    themes?: any,
    fontsets?: any,
    fontsizes?: any,
    value?: any,
    onChange?: any,
    formats?: any,
}

export default Designer;
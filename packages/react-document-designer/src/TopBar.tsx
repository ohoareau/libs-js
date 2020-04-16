import React from 'react';
import Selectors from './Selectors';
import component from '@ohoareau/react-component';
import ModeSelector from './ModeSelector';
import DownloadButtons from './DownloadButtons';

export const TopBar = component<TopBarProps>(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.palette.primary.dark,
        borderBottom: '1px solid rgb(225, 225, 225)',
        padding: 10,
        boxSizing: 'border-box',
    },
    left: {
        flex: 1,
        display: 'flex',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
    },
}), ({classes = {}, doc, fragments = [], choices = {}, modes = {}, selection = {}, onChangeModes, onChangeSelection}: TopBarProps) => (
    <div className={classes.root}>
        <div className={classes.left}>
            <Selectors choices={choices} value={selection} onChange={onChangeSelection} />
        </div>
        <div className={classes.right}>
            <ModeSelector value={modes} onChange={onChangeModes} />
            <DownloadButtons doc={doc} fragments={fragments} />
        </div>
    </div>
));

export interface TopBarProps {
    classes?: any,
    doc: any,
    fragments: any[],
    choices?: any,
    modes?: any,
    selection?: any,
    onChangeModes?: any,
    onChangeSelection?: any,
}

export default TopBar
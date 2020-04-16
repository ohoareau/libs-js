import React, {useMemo, useState} from 'react';
import Switch from '@material-ui/core/Switch';
import Viewer from './Viewer';
import Navigator from './Navigator';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import ZoomSlider from './ZoomSlider';

export const Thumbnail = component<ThumbnailProps>(theme => ({
    root: {
        position: 'relative',
        minWidth: 177,
        margin: 20,
        padding: 3,
        transition: 'transform 0.2s ease-in-out',
        display: 'inline-block',
        backgroundColor: 'white',
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.025)',
            backgroundColor: theme.palette.primary.dark,
        }
    },
    rootActive: {
        backgroundColor: theme.palette.primary.dark,
    },
    label: {
        position: 'absolute',
        bottom: 3,
        left: 3,
        right: 3,
        backgroundColor: theme.palette.primary.main,
        justifyContent: 'center',
        minHeight: 50,
        textAlign: 'center',
        alignItems: 'center',
        color: 'white',
        display: 'flex',
        padding: 5,
    },
}), ({classes = {}, active = false, onClick, fragment, model, config, stylesheet, zoom = 0.35}: ThumbnailProps) => {
    const document = useMemo(
        () => ({fragments: [fragment], model, config, stylesheet}),
        [fragment, model, config, stylesheet]
    );
    return (
        <div className={(active ? [classes.root, classes.rootActive] : [classes.root]).join(' ')} onClick={onClick}>
            <Viewer noMargin document={document} zoom={zoom} page={0} />
            <Typography className={classes.label}>{fragment.name}</Typography>
        </div>
    );
});

export interface ThumbnailProps {
    classes?: any,
    fragment: any,
    model: any,
    config: any,
    stylesheet: any,
    zoom?: number,
    active?: boolean,
    onClick?: any,
}

export const DocumentNavigation = component<DocumentNavigationProps>(theme => ({
    root: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        overflow: 'scroll',
        backgroundColor: 'rgb(225, 225, 225)',
    },
    thumbContent: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
    },
    thumbnails: {
        flex: 1,
        flexWrap: 'wrap',
        overflow: 'scroll',
        backgroundColor: 'rgb(225, 225, 225)',
    },
    zoom: {
        padding: 5,
    },
}), ({classes = {}, fragments = [], doc, defaultThumbZoom = 0.35, current = undefined, setCurrent}: DocumentNavigationProps) => {
    const [thumbZoom, onThumbZoomChange] = useState(defaultThumbZoom);
    const [view, setView] = useState('list');
    const handleChange = e => setView(e.target.checked ? 'thumbnails' : 'list');
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography>Liste</Typography>
                <Switch checked={view === 'thumbnails'} onChange={handleChange} />
                <Typography>Vignettes</Typography>
            </div>
            <div className={classes.content}>
                {view === 'list' && <Navigator fragments={fragments} current={current} onChange={setCurrent}/>}
                {view === 'thumbnails' && (
                    <div className={classes.thumbContent}>
                        <div className={classes.thumbnails}>
                            {fragments.map((t, i) => (
                                <Thumbnail key={i} fragment={t} active={current && (current === t.id)} model={doc.model} config={doc.config} stylesheet={doc.stylesheet} zoom={thumbZoom} onClick={() => {setCurrent(t.id);}} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {view === 'thumbnails' && (
                <div className={classes.zoom}>
                    <ZoomSlider valueLabelDisplay={'auto'} valueLabelFormat={v => `${Math.floor(v) + 50}%`} value={(thumbZoom * 100) + (50 - defaultThumbZoom * 100)} onChange={(_, v) => onThumbZoomChange((v -(50 - defaultThumbZoom * 100)) / 100)} />
                </div>
            )}
        </div>
    );
});

export interface DocumentNavigationProps {
    classes?: any,
    fragments?: any[],
    doc: any,
    defaultThumbZoom?: number,
    current?: any,
    setCurrent?: any,
    onClick?: any,
}

export default DocumentNavigation
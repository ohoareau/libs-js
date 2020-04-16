import React, {useState} from 'react';
import Viewer from './Viewer';
import component from '@ohoareau/react-component';
import ZoomSlider from './ZoomSlider';

const PageWrapper = component<PageWrapperProps>({
    root: {
        display: 'inline-block',
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 30,
        marginRight: 30,
    }
}, ({classes = {}, children}: PageWrapperProps) => (
    <div className={classes.root}>
        {children}
    </div>
));

export interface PageWrapperProps {
    classes?: any,
    children?: any,
}

const DocumentPreview = component<DocumentPreviewProps>({
    root: {
        flex: 1,
        backgroundColor: 'rgb(245, 245, 245)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    viewerContent: {
        display: 'flex',
        flex: 1,
        overflow: 'scroll',
    },
}, ({classes = {}, doc, defaultPreviewZoom = .68}) => {
    const [previewZoom, onPreviewZoomChange] = useState(defaultPreviewZoom);
    return (
        <div className={classes.root}>
            <div className={classes.viewerContent}>
                <Viewer document={doc} zoom={previewZoom} pageWrapper={PageWrapper} />
            </div>
            <div style={{padding: 5}}>
                <ZoomSlider valueLabelDisplay={'auto'} valueLabelFormat={v => `${Math.floor(v) + 50}%`} value={previewZoom * 100 + (50 - defaultPreviewZoom * 100)} onChange={(_, v) => onPreviewZoomChange((v - (50 - defaultPreviewZoom * 100)) / 100)} />
            </div>
        </div>
    );
});

export interface DocumentPreviewProps {
    classes?: any,
    defaultPreviewZoom?: number,
    doc?: any,
}

export default DocumentPreview
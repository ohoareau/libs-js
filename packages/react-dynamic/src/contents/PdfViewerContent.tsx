import React from 'react';
import component from '@ohoareau/react-component';

export const PdfViewerContent = component<PdfViewerContentProps>({
    root: {
        width: '100%',
        minHeight: 750,
    },
}, ({classes = {}, path}: PdfViewerContentProps) => (
    <embed src={path} className={classes.root} type={'application/pdf'} />
));

export interface PdfViewerContentProps {
    classes?: {[key: string]: any},
    path: string,
}

export default PdfViewerContent
import React, {ComponentType} from 'react'
import {Document} from '@ohoareau/react-document-renderer';
import PdfViewer from './PdfViewer';

const Viewer: ComponentType<ViewerProps> = ({document}: ViewerProps) => (
    <PdfViewer document={<Document document={document} />} />
);

export interface ViewerProps {
    document: any,
}

export default Viewer
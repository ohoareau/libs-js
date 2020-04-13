import React, {ComponentType} from 'react'
import PdfViewer from './PdfViewer';
import {Document} from '@ohoareau/react-document-renderer';

const Viewer: ComponentType<ViewerProps> = ({document}: ViewerProps) => (
    <PdfViewer document={<Document document={document} />} />
);

export interface ViewerProps {
    document: any,
}

export default Viewer
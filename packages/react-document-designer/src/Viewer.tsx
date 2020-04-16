import React, {ComponentType, memo} from 'react'
import PdfViewer from './PdfViewer';
import {Document} from '@ohoareau/react-document-renderer';
import debounceRender from 'react-debounce-render';

const Viewer: ComponentType<ViewerProps> = debounceRender(memo(({noMargin = false, document, zoom, page, pageWrapper}: ViewerProps) => (
    <PdfViewer document={<Document document={document} />} zoom={zoom} page={page} noMargin={noMargin} pageWrapper={pageWrapper} />
)));

export interface ViewerProps {
    document: any,
    zoom?: number,
    page?: number,
    noMargin?: boolean,
    pageWrapper?: any,
}

export default Viewer
import React, {useState, useEffect, useCallback} from 'react'
import Page from 'react-pdf/dist/Page';
// noinspection ES6CheckImport
import {pdf} from '@react-pdf/renderer';
import {pdfjs}  from 'react-pdf';
import component from '@ohoareau/react-component';
import PdfDocument from 'react-pdf/dist/Document';

pdfjs['GlobalWorkerOptions'].workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DefaultPageWrapper = ({children}) => <>{children}</>;

const PdfViewer = component<PdfViewerProps>({
    page: {
    }
}, ({classes = {}, document, onError, zoom = 1.0, page = undefined, noMargin = false, pageWrapper}: PdfViewerProps) => {
    const [doc, setDoc]: [any, any] = useState(undefined);
    const [numPages, setNumPages] = useState(0);
    const PageWrapper = pageWrapper || DefaultPageWrapper;
    const onLoadSuccess = useCallback(({numPages}) => {
        setNumPages(numPages);
    }, [setNumPages]);
    useEffect(() => {
        try {
            pdf(document).toBlob().then(blob => setDoc(URL.createObjectURL(blob)));
        } catch (error) {
            onError && onError(error);
        }
    }, [document, onError, setDoc]);
    return (
        <div style={{flex: 1, display: 'flex', position: 'relative', width: '100%', textAlign: 'center', alignItems: 'center', flexDirection: 'column', margin: noMargin ? 0 : 25}}>
            <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                {!!doc && (
                    <PdfDocument sandbox={'allow-same-origin'} loading={null} file={doc} onLoadSuccess={onLoadSuccess} renderMode={'svg'}>
                        {undefined === page && [...Array(numPages).keys()].map(
                            i => (
                                <PageWrapper key={`page_${i + 1}`}>
                                    <Page wrap loading={null} scale={zoom} className={classes.page} pageNumber={i + 1} />
                                </PageWrapper>
                            )
                        )}
                        {undefined !== page && <Page wrap loading={null} scale={zoom} className={classes.page} key={`page_${page + 1}`} pageNumber={page + 1} />}
                    </PdfDocument>
                )}
            </div>
        </div>
    );
}, undefined, {i18n: false});

export interface PdfViewerProps {
    classes?: {[key: string]: any},
    document: JSX.Element,
    onError?: any,
    zoom?: number,
    page?: number,
    noMargin?: boolean,
    pageWrapper?: any,
}

export default PdfViewer
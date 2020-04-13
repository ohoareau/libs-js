import React, {useState, useEffect, useCallback} from 'react'
import Page from 'react-pdf/dist/Page';
// noinspection ES6CheckImport
import {pdf} from '@react-pdf/renderer';
import {pdfjs}  from 'react-pdf';
import component from '@ohoareau/react-component';
import PdfDocument from 'react-pdf/dist/Document';

pdfjs['GlobalWorkerOptions'].workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = component<PdfViewerProps>({
    page: {
        marginBottom: 30,
    }
}, ({classes = {}, document, onError}: PdfViewerProps) => {
    const [doc, setDoc]: [any, any] = useState(undefined);
    const [numPages, setNumPages] = useState(0);
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
        <div style={{flex: 1, display: 'flex', position: 'relative', flexDirection: 'column', margin: 25}}>
            <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
                {!!doc && (
                    <PdfDocument file={doc} onLoadSuccess={onLoadSuccess} renderMode={'svg'}>
                        {[...Array(numPages).keys()].map(
                            i => <Page scale={0.73} className={classes.page} key={`page_${i + 1}`} pageNumber={i + 1} />,
                        )}
                    </PdfDocument>
                )}
            </div>
        </div>
    );
});

export interface PdfViewerProps {
    classes?: {[key: string]: any},
    document: JSX.Element,
    onError?: any,
}

export default PdfViewer
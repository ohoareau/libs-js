import React, {useCallback} from 'react';
import {pdf} from '@react-pdf/renderer';
import {Button} from '@ohoareau/react-button';
import component from '@ohoareau/react-component';
import GetAppIcon from '@material-ui/icons/GetApp';
import {Document} from '@ohoareau/react-document-renderer';

const downloadPdf = async document => open(
    URL.createObjectURL(
        new Blob([await pdf(<Document document={document} />).toBlob()], {type: 'application/pdf'})
    )
);

export const DownloadButtons = component<DownloadButtonsProps>({
    root: {
        color: 'white',
    },
    button: {
        marginLeft: 30,
    },
}, ({classes = {}, doc, fragments = []}: DownloadButtonsProps) => {
    const onDownload = useCallback(async () =>
        downloadPdf({...doc, fragments}),
        [doc, fragments]
    );
    return (
        <div className={classes.root}>
            <Button onClick={onDownload} color={'inherit'}
                    className={classes.button} variant={'outlined'}
                    label={'Télécharger'} startIcon={<GetAppIcon />}
            />
        </div>
    );
});

export interface DownloadButtonsProps {
    classes?: any,
    doc: any,
    fragments?: any[],
}

export default DownloadButtons
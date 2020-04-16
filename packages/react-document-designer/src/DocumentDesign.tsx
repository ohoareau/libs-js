import React from 'react';
import Editor from './Editor';
import component from '@ohoareau/react-component';

export const DocumentDesign = component<DocumentDesignProps>({
    root: {
        flex: 1,
        backgroundColor: 'white',
        overflow: 'scroll',
    },
}, ({classes = {}, value = {}, doc, onChange}: DocumentDesignProps) => (
    <div className={classes.root}>
        <Editor doc={doc} config={value} onChange={onChange}/>
    </div>
));

export interface DocumentDesignProps {
    classes?: any,
    doc?: any,
    value?: any,
    onChange: any,
}

export default DocumentDesign
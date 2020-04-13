import React from 'react';
import Img from 'react-image';
import component from '@ohoareau/react-component';

export const ImageContent = component<ImageContentProps>({
    root: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}, ({classes = {}, path}: ImageContentProps) => (
    <Img className={classes.root} src={path} />
));

export interface ImageContentProps {
    classes ?: {[key: string]: any},
    path: string,
}

export default ImageContent
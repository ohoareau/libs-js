import React from 'react';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import {replaceVars} from '@ohoareau/string';

export const TextContent = component<TextContentProps>(undefined, ({i18n = {}, text, ...props}: TextContentProps) => (
    <Typography>{replaceVars(
        text ? ('string' === typeof text) ? text : (text[i18n.language] || text[Object.keys(text).shift() as string]) : '',
        props
    )}</Typography>
));

export interface TextContentProps {
    i18n?: any,
    text?: any,
}

export default TextContent
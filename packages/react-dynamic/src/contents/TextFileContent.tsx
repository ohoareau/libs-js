import React, {useEffect, useState} from 'react';
import {docco} from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import component from '@ohoareau/react-component';

SyntaxHighlighter.registerLanguage('json', json);

export const TextFileContent = component<TextFileContentProps>({
    undefinedRoot: {
    },
}, ({classes = {}, path}: TextFileContentProps) => {
    const [data, setData]: [any, any] = useState(undefined);
    useEffect(() => {
        fetch(path).then(r => {
            r.text().then(setData);
        });
    }, [path]);
    return (
        undefined === data
            ? <div className={classes.undefinedRoot}>...</div>
            : <SyntaxHighlighter customStyle={{width: '100%'}}
                                 showLineNumbers={true}
                                 language="json"
                                 style={docco}
                                 wrapLines={true}
            >{data}</SyntaxHighlighter>
    );
});

export interface TextFileContentProps {
    classes?: {[key: string]: any},
    path: string,
}

export default TextFileContent
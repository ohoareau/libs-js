import React, {ComponentType} from 'react';
import Fragment from './Fragment';
import {Document as RendererDocument, Font} from '@react-pdf/renderer';
import {ModelProvider} from './contexts/ModelContext';
import {ConfigProvider} from './contexts/ConfigContext';
import {StylesheetProvider} from './contexts/StylesheetContext';
import {SuggestionsProvider} from './contexts/SuggestionsContext';
import {document_definition, document_stylesheet} from "./types";
const Document: ComponentType<DocumentProps> = ({document = {fragments: [], config: {}, model: {}, suggestions: {}}}: DocumentProps) => {
    Object.values((document.stylesheet || {}).fonts || {}).forEach((f) => Font.register(f as any))
    return (
        <StylesheetProvider value={document.stylesheet as document_stylesheet}>
            <ModelProvider value={document.model}>
                <RendererDocument>
                    {((document.fragments || []) as any[]).map((f, i) => (
                        <ConfigProvider key={i} value={(document.config || {})[f.id] || {}}>
                            <SuggestionsProvider key={i} value={(document.suggestions || {}).ids || {}}>
                                <Fragment fragment={f} />
                            </SuggestionsProvider>
                        </ConfigProvider>
                    ))}
                </RendererDocument>
            </ModelProvider>
        </StylesheetProvider>
    );
}

export interface DocumentProps {
    document?: document_definition,
}
export default Document
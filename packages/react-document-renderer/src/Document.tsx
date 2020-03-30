import React, {ComponentType} from 'react';
import Fragment from './Fragment';
import {Document as RendererDocument} from '@react-pdf/renderer';

const Document: ComponentType<DocumentProps> = ({document = {fragments: []}}: DocumentProps) => (
    <RendererDocument>
        {(document.fragments || []).map((f, i) => <Fragment key={i} fragment={f} />)}
    </RendererDocument>
);

export interface DocumentProps {
    document?: {fragments: any[]},
}
export default Document
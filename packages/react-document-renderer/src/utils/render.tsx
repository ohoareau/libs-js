import React from 'react';
import {pdf} from "@react-pdf/renderer";
import Document from "../Document";
import {streamToBuffer} from '@jorgeferrero/stream-to-buffer';
import {document_definition} from '../types';

export async function render(document: document_definition): Promise<Buffer> {
    return streamToBuffer(await pdf(<Document document={document} />).toBuffer())
}

export default render
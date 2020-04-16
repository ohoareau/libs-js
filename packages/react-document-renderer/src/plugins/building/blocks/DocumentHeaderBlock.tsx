import React from 'react';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../../hocs';
import ParagraphBlock from '../../../blocks/ParagraphBlock';

export const DocumentHeaderBlock = pdfComponent(undefined, ({s = () => {}}: DocumentHeaderBlockProps) => (
    <View style={s('building_document_header')}>
        <View style={s('building_document_header_col1')}>
            <ParagraphBlock block={{text: 'LOGO'}} />
        </View>
        <View style={s('building_document_header_col2')}>
            <View style={s('building_document_header_col2_line1')}>
                <ParagraphBlock dynamic block={{text: 'SCI QUERCI'}} />
            </View>
            <View style={s('building_document_header_col2_line2')}>
                <ParagraphBlock dynamic block={{text: 'Note de calcul dallage indice 2 en date du 19/12/2019'}} />
            </View>
        </View>
    </View>
));

export interface DocumentHeaderBlockProps {
    s?: Function,
}

export default DocumentHeaderBlock
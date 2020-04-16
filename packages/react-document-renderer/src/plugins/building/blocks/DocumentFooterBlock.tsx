import React from 'react';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../../hocs';
import ParagraphBlock from '../../../blocks/ParagraphBlock';

export const DocumentFooterBlock = pdfComponent(undefined, ({s = () => {}}: DocumentFooterBlockProps) => (
    <View style={s('building_document_footer')}>
        <View style={s('building_document_footer_line1')}>
            <View style={{flex: 1}}>
                <ParagraphBlock block={{text: '**Emetteur** : AMOCER-IDF -> **Client** : OMNIUM DALLAGE - Benoit Loubaud'}} />
            </View>
            <View>
                <ParagraphBlock dynamic block={{text: '**Page** {{pageNumber}}'}} />
            </View>
        </View>
        <View style={s('building_document_footer_line2')}>
            <ParagraphBlock block={{text: '**AMOCER-IDF - 25 rue du Faubourg Poissonnière 75009 Paris - Siren : 53257238500013**'}} />
        </View>
    </View>
));

export interface DocumentFooterBlockProps {
    s?: Function,
}

export default DocumentFooterBlock
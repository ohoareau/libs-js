import React from 'react';
import {View} from '@react-pdf/renderer';
import {pdfComponent} from '../../../hocs';
import ParagraphBlock from '../../../blocks/ParagraphBlock';

const DocumentCoverLogoBlock = pdfComponent(undefined, ({s = () => {}}) => (
    <View style={s('building_document_cover_logo')}>
        <ParagraphBlock block={{text: 'LOGO'}} />
    </View>
));

export default DocumentCoverLogoBlock
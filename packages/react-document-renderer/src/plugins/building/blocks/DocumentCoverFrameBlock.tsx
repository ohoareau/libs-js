import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {pdfComponent} from '../../../hocs';

const DocumentCoverFrameBlock = pdfComponent(undefined, ({block, s = () => {}}) => (
    <View style={s('building_document_cover_frame')}>
        <View style={s('building_document_cover_frame_header')}>
            <Text style={s('building_document_cover_frame_title')}>{block.title}</Text>
        </View>
        <View style={s('building_document_cover_frame_container')}>
            <Text style={s('building_document_cover_frame_subtitle')}>{block.subTitle}</Text>
            <View style={s('building_document_cover_frame_container_description')}>
                <Text style={s('building_document_cover_frame_container_text')}>HELLO</Text>
            </View>
        </View>
    </View>
));

export default DocumentCoverFrameBlock
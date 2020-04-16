export default {
    id: '_basic',
    name: 'Basic',
    description: 'Basic',
    types: {
        page: {
            paddingTop: 15,
            paddingBottom: 70,
            paddingHorizontal: 35,
            fontFamily: '$fontFamily1',
            fontSize: '$fontSize7',
        },
        header: {
            fontSize: '$fontSize7',
            marginBottom: 15,
            textAlign: 'center',
        },
        content: {
        },
        footer: {
            position: 'absolute',
            fontSize: '$fontSize7',
            bottom: 0,
            left: 0,
            right: 0,
        },
        heading: {
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '$fontSize3',
            marginTop: 10,
            marginBottom: 30,
        },
        heading1: {
            backgroundColor: '$backgroundColor1',
            color: '$fontColor2',
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '$fontSize2',
            padding: 10,
            marginTop: 10,
            marginBottom: 30,
        },
        heading2: {
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '$fontSize4',
            marginTop: 5,
            marginBottom: 15,
        },
        heading3: {
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '$fontSize5',
            marginTop: 5,
            marginBottom: 10,
        },
        heading4: {
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '$fontSize6',
            marginTop: 10,
            marginBottom: 10,
        },
        unknown: {
            border: '1px solid $borderColor2',
            padding: 15,
            minHeight: 50,
            textAlign: 'center',
            backgroundColor: '$backgroundColor2',
            color: '$fontColor2',
        },
        space: {
            height: 30,
        },
        list: {
        },
        list_item: {
            marginBottom: 5,
        },
        list_item_content: {
        },
        list_item_bullet_point: {
            width: 10,
            marginLeft: 30,
            marginRight: 15,
        },
        table: {
            borderStyle: 'solid',
            borderColor: '$borderColor1',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0
        },
        table_row_cell: {
            borderStyle: 'solid',
            borderColor: '$borderColor1',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
        },
        table_row_headercell: {
            borderStyle: 'solid',
            borderColor: '$borderColor1',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            backgroundColor: '$backgroundColor1',
            color: '$fontColor1',
            borderBottomColor: '$borderColor1',
            fontFamily: '$fontFamily1',
        },
        table_row_cell_container: {
            margin: 5,
            fontSize: '$fontSize7',
        },
        table_row_headercell_container: {
            margin: 5,
            fontSize: '$fontSize7',
            fontWeight: 'bold',
        },
        building_document_cover_frame: {
            marginTop: 30,
            marginBottom: 30,
        },
        building_document_cover_frame_header: {
            backgroundColor: '$backgroundColor1',
            paddingVertical: 10,
            paddingHorizontal: 5,
            fontSize: '$fontSize3',
            color: '$fontColor2',
        },
        building_document_cover_frame_container: {
            paddingVertical: 10,
            paddingHorizontal: 5,
            backgroundColor: '$backgroundColor2',
            minHeight: 250,
        },
        building_document_cover_frame_subtitle: {
            fontSize: '$fontSize2',
            marginBottom: 15,
        },
        building_document_cover_frame_container_description: {
            paddingLeft: 40,
        },
        building_document_footer: {
            textAlign: 'center',
            marginLeft: 35,
            marginRight: 35,
        },
        building_document_footer_line1: {
            fontSize: '$fontSize7',
            lineHeight: 0.5,
            display: 'flex',
            flexDirection: 'row',
            borderStyle: 'solid',
            borderColor: '$borderColor1',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            borderRightWidth: 0,
        },
        layouts_row011: {
            display: 'flex',
            flexDirection: 'row',
        },
        layouts_row011_col1: {
            flex: 1,
        },
        layouts_row011_col2: {
            flex: 3,
        },
        layouts_row011_col2_line1: {
            fontSize: '$fontSize2',
            lineHeight: 0.7,
        },
        layouts_row011_col2_line2: {
            fontSize: '$fontSize7',
            lineHeight: 0.5,
        },
        building_document_cover_logo: {
            paddingTop: 70,
            height: 200,
        },
        paragraph: {
            fontFamily: '$fontFamily1',
            textAlign: 'left',
        },
        parapraph_text: {
            fontFamily: '$fontFamily1',
        },
        paragraph_emphasis: {
            fontFamily: '$fontFamily1',
            fontStyle: 'italic',
        },
        paragraph_strong: {
            fontFamily: '$fontFamily1',
            fontWeight: 'bold',
        },
        paragraph_underlined: {
            fontFamily: '$fontFamily1',
            textDecoration: 'line-through',
        },
        paragraph_inline_code: {
            backgroundColor: '$backgroundColor2',
            color: '$fontColor2',
            fontFamily: '$fontFamily1',
        },
        paragraph_first: {
            marginBottom: 15,
        },
    }
}
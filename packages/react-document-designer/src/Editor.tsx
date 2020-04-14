import React from 'react';
import component from '@ohoareau/react-component';

const Editor = component<EditorProps>(undefined, ({fragment}: EditorProps) => (
    <div>
        {!!fragment && <>{fragment.id}</>}
    </div>
), undefined, {i18n: false});

export interface EditorProps {
    fragment: {id: string, [key: string]: any},
    onChange?: any,
}

export default Editor;
import React, {ComponentType} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const Editor: ComponentType<EditorProps> = withStyles(() => ({

}))(({fragment, onChange}: EditorProps) => {
    return (
        <div>
            {!!fragment && <>{fragment.id}</>}
        </div>
    );
});

export interface EditorProps {
    fragment: {id: string, [key: string]: any},
    onChange?: any,
}

export default Editor;
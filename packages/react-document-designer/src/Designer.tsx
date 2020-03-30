import React, {ComponentType, useCallback, useState} from 'react';
import Editor from './Editor';
import Viewer from './Viewer';
import InfoIcon from '@material-ui/icons/Info';
import Navigator from './Navigator';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {buildTemplatedDocumentFragment, buildTemplatedDocumentFragmentList} from './utils';

const Designer: ComponentType<DesignerProps> = withStyles(() => ({
    root: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 64,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    navigator: {
        flex: 2,
        backgroundColor: 'rgb(225, 225, 225)',
        borderRight: '1px solid rgb(205, 205, 205)',
        boxSizing: 'border-box',
        overflow: 'scroll',
    },
    editor: {
        flex: 4,
        backgroundColor: 'white',
        overflow: 'scroll',
    },
    viewer: {
        flex: 5,
        backgroundColor: 'rgb(225, 225, 225)',
        display: 'flex',
        overflow: 'scroll',
    },
    bottomBar: {
        display: 'flex',
        flexDirection: 'column',
        height: 52,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderTop: '1px solid rgb(225, 225, 225)',
    },
    bottomInformation: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 15,
        color: 'rgb(145, 145, 145)',
    },
    infoIcon: {
        marginRight: 5,
    },
    infoText: {
        flex: 1,
    },
}))(({model, template, data, onChange, classes = {}}: DesignerProps) => {
    const [current, setCurrent]: [any, any] = useState(undefined);
    const fragments = buildTemplatedDocumentFragmentList(template, data, model);
    const fragment = buildTemplatedDocumentFragment(template, data, model, current);
    const partialDocument = {fragments: [fragment]};
    const onChangeData = useCallback(values => {
        !!current && onChange({...data, fragments: {...data.fragments, [current]: values}});
    }, [onChange, data, current]);
    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <div className={classes.navigator}>
                    <Navigator fragments={fragments} current={current} onChange={setCurrent} />
                </div>
                <div className={classes.editor}>
                    <Editor fragment={fragment} onChange={onChangeData} />
                </div>
                <div className={classes.viewer}>
                    <Viewer document={partialDocument} />
                </div>
            </div>
            <div className={classes.bottomBar}>
                <div className={classes.bottomInformation}>
                    <InfoIcon className={classes.infoIcon} />
                    <Typography className={classes.infoText}>
                        Vos modifications sont sauvegardées automatiquement.
                    </Typography>
                </div>
            </div>
        </div>
    );
});

export interface DesignerProps {
    model?: any,
    template?: any,
    data?: any,
    onChange?: any,
    classes?: {[key: string]: any},
}

export default Designer;
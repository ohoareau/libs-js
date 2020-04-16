import React, {useCallback} from 'react';
import component from '@ohoareau/react-component';
import DocumentDesign from './DocumentDesign';
import DocumentPreview from './DocumentPreview';
import DocumentNavigation from './DocumentNavigation';

export const WorkBench = component<WorkBenchProps>({
    root: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    navigation: {
        flex: props => props.modes.design ? (props.modes.preview ? 2 : 3) : 2,
        display: 'flex',
        overflow: 'hidden',
    },
    preview: {
        flex: props => props.modes.design ? 5 : 9,
        display: 'flex',
        overflow: 'hidden',
    },
    design: {
        flex: props => props.modes.preview ? 4 : 9,
        overflow: 'scroll',
    },
}, ({classes = {}, modes = {}, doc, fragments = [], current, setCurrent, onChange}: WorkBenchProps) => {
    const onChangeConfig = useCallback(values => {
        !!current && onChange && onChange({...doc.config, [current]: {...(doc.config[current] || {}), ...values}});
    }, [onChange, doc.config, current]);
    return (
        <div className={classes.root}>
            {modes['navigation'] && (
                <div className={classes.navigation}>
                    <DocumentNavigation doc={doc} fragments={fragments} current={current} setCurrent={setCurrent} />
                </div>
            )}
            {modes['preview'] && (
                <div className={classes.preview}>
                    <DocumentPreview doc={doc} />
                </div>
            )}
            {modes['design'] && (
                <div className={classes.design}>
                    <DocumentDesign doc={doc} value={(current ? doc.config[current] : undefined) || {}} onChange={onChangeConfig} />
                </div>
            )}
        </div>
    );
});

export interface WorkBenchProps {
    classes?: any,
    modes?: any,
    doc: any,
    fragments?: any[],
    current: any,
    setCurrent: any,
    onChange?: any,
}

export default WorkBench
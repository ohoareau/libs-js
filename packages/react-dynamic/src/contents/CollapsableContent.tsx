import React from 'react';
import Paper from '@material-ui/core/Paper';
import component from '@ohoareau/react-component';
import {v4 as uuid} from 'uuid';
import {replaceVars} from '@ohoareau/string';
import {Collapsable} from '@ohoareau/react-collapsable';
import {getModuleSync} from '@ohoareau/react-moduled';
import ModuleTypePanelContents from '../ModuleTypePanelContents';
import describeContentContainer from '@ohoareau/contents';

export const CollapsableContent = component<CollapsableContentProps>(theme => ({
    summary: {
        backgroundColor: theme.palette.info.light,
    },
}), ({classes = {}, name, contents = [], context = {}, data = {}}: CollapsableContentProps) => {
    const id = uuid();
    const def = describeContentContainer(context.type.reduce((acc, t) => acc.models[t] || {models: {}}, getModuleSync(context.module)), {contents});
    return (
        <Collapsable id={id} title={replaceVars(name, data)}>
            <Paper elevation={0} square className={classes.summary}>
                <ModuleTypePanelContents item={data} module={context.module} type={context.type} panel={id} first={true} contents={def.contents} />
            </Paper>
        </Collapsable>
    )
});

export interface CollapsableContentProps {
    classes?: {[key: string]: any},
    name: string,
    contents?: any[],
    context?: any,
    data?: any,
}

export default CollapsableContent
import React from 'react';
import component from '@ohoareau/react-component';
import ModuleTypePanelContent from './ModuleTypePanelContent';

export const ModuleTypePanelContents = component<ModuleTypePanelContentsProps>({
    contentContainer: {
        marginBottom: 15,
    },
}, ({classes = {}, item, module, type, panel, first, contents = [], context = {}}: ModuleTypePanelContentsProps) => (
    <>
        {((contents || []) as any[]).map((content: any, i: number): any => (
            <div key={i} className={classes.contentContainer}>
                <ModuleTypePanelContent
                     item={item}
                     module={module} type={type} panel={panel}
                     definition={content}
                     first={first && (i === 0)}
                     localFirst={true}
                     context={context}
                />
            </div>
        ))}
    </>
));

export interface ModuleTypePanelContentsProps {
    classes?: {[key: string]: any},
    item: any,
    module: string,
    type: any,
    panel: string,
    first?: boolean,
    contents?: any[],
    context?: any,
}

export default ModuleTypePanelContents
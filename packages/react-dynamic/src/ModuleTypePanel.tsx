import React, {ComponentType} from 'react';
import {useModuleTypePanel} from './hooks';
import ModuleTypePanelContents from './ModuleTypePanelContents';

const ModuleTypePanel: ComponentType<ModuleTypePanelProps> = ({module, type, name, first = false, ...props}: ModuleTypePanelProps) => {
    const {contents} = useModuleTypePanel(module, type, name);
    return (
        <>
            {!!contents.length && (
                <ModuleTypePanelContents module={module} type={type} panel={name} first={first} contents={contents} {...props} />
            )}
        </>
    );
};

export interface ModuleTypePanelProps {
    module: string,
    type: any,
    name: string,
    first?: boolean,
    item: any,
    context: any,
}

export default ModuleTypePanel
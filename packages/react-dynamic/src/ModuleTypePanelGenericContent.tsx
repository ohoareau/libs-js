import React, {ComponentType, memo} from 'react';
import {useModulePanelGenericContent} from "./hooks";

const ModuleTypePanelGenericContent: ComponentType<ModuleTypePanelGenericContentProps> = memo(({item, panel, module, type, definition, context}: ModuleTypePanelGenericContentProps) => {
    const [Component] = useModulePanelGenericContent(panel, definition, {module, type, panel, ...context}) as unknown as [ComponentType<{name: string, data: any}>];
    return <Component name={definition.name} data={item} />;
});

export interface ModuleTypePanelGenericContentProps {
    item: any,
    panel: string,
    module: string,
    type: any,
    definition: any,
    context: any,
    first?: boolean,
}

export default ModuleTypePanelGenericContent
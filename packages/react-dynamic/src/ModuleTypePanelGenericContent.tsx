import React, {ComponentType, memo, Suspense, useCallback} from 'react';
import cache from '@ohoareau/cache';
import {camelcase} from '@ohoareau/string';
import {getModuleComponent} from '@ohoareau/react-moduled';

const ModuleTypePanelGenericContent: ComponentType<ModuleTypePanelGenericContentProps> = memo(({item, panel, module, type, definition, context}: ModuleTypePanelGenericContentProps) => {
    const factory = useCallback(() => {
        const tokens = (definition.type as string).split(/:/);
        const [module, name] = (1 < tokens.length)
            ? [tokens[0], camelcase(tokens.slice(1).join(':'), 'Content')]
            : ['root', camelcase(definition.type, 'Content')]
        ;
        return getModuleComponent({module, path: 'contents', name}, <div />);
    }, [definition]);
    const Component = cache.getset('components', `${module}-${type}-panels-${panel}-generics-${definition.type}`, factory);
    const WrapperComponent: ComponentType<{[key: string]: any}> = memo(props => (
        <Suspense fallback={<div/>}>
            <Component {...definition} {...props} context={{context, module, type, panel}} />
        </Suspense>
    ));
    return <WrapperComponent name={definition.name} data={item} />;
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
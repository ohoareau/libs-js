import React, {ComponentType, memo} from 'react';
import component from '@ohoareau/react-component';
import applyConditions from '@ohoareau/conditions';
import ModuleTypePanelGenericContent from './ModuleTypePanelGenericContent';

const ModuleTypePanelContent: ComponentType<ModuleTypePanelContentProps> = memo(component<ModuleTypePanelContentProps>({
    arrayContainer: {
        display: 'flex',
    },
    firstItemContainer: {
        flex: 1,
    },
    itemContainer: {
        flex: 1,
        marginLeft: 15,
    }
}, ({classes = {}, item, panel, module, type, definition, firstOfRow = true, first = false, localFirst = true, context = {}, ...props}: ModuleTypePanelContentProps) => {
    if (Array.isArray(definition)) return (
        <div className={classes.arrayContainer}>
            {definition.map((d, i) => (
                <ModuleTypePanelContent
                    key={i}
                    item={item}
                    module={module} type={type} panel={panel}
                    definition={d}
                    first={first && i === 0}
                    firstOfRow={firstOfRow && i === 0}
                    localFirst={i === 0}
                    context={context}
                    {...props}
                />
            ))}
        </div>
    );
    const {contentType, ...def} = definition;
    return (
        <div className={firstOfRow ? classes.firstItemContainer : classes.itemContainer}>
            {applyConditions(def, {item, module, type, definition}) && (
                <ModuleTypePanelGenericContent definition={def}
                                               item={item}
                                               module={module} type={type} panel={panel}
                                               first={first}
                                               context={context}
                                               {...props}
                />
            )}
        </div>
    );
}));

export interface ModuleTypePanelContentProps {
    classes?: {[key: string]: any},
    item?: any,
    panel: string,
    module: string,
    type: any,
    definition: any,
    firstOfRow?: boolean,
    first?: boolean,
    localFirst?: boolean,
    context?: any,
}

export default ModuleTypePanelContent
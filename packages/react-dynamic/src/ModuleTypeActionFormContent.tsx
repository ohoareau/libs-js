import React, {ComponentType, memo} from 'react';
import component from '@ohoareau/react-component';
import applyConditions from '@ohoareau/conditions';
import ModuleTypeActionFormField, {ModuleTypeActionFormFieldProps} from './ModuleTypeActionFormField';
import ModuleTypeActionFormGenericContent, {ModuleTypeActionFormGenericContentProps} from './ModuleTypeActionFormGenericContent';

const map = {field: ModuleTypeActionFormField, empty: () => <></>, default: ModuleTypeActionFormGenericContent};

const ModuleTypeActionFormContent: ComponentType<ModuleTypeActionFormContentProps> = memo(component<ModuleTypeActionFormContentProps>({
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
}, ({classes = {}, form, module, type, context, action, definition, firstOfRow = true, first = false, localFirst = true, ...props}: ModuleTypeActionFormContentProps) => {
    if (Array.isArray(definition)) return (
        <div className={classes.arrayContainer}>
            {definition.map((d, i) => (
                <ModuleTypeActionFormContent
                    key={i}
                    form={form}
                    module={module} type={type} action={action}
                    context={context}
                    definition={d}
                    first={first && i === 0}
                    firstOfRow={firstOfRow && i === 0}
                    localFirst={i === 0}
                    {...props}
                />
            ))}
        </div>
    );
    const {contentType, ...def} = definition;
    const Component = map[definition.contentType] || map.default;
    return (
        <div className={firstOfRow ? classes.firstItemContainer : classes.itemContainer}>
            {!!Component && applyConditions(def, {module, type, definition}) && (
                <Component definition={def}
                           form={form}
                           module={module} type={type} action={action}
                           context={context}
                           first={first}
                           {...props}
                />
            )}
        </div>
    );
}));

export interface ModuleTypeActionFormContentProps extends ModuleTypeActionFormFieldProps, ModuleTypeActionFormGenericContentProps {
    classes?: {[key: string]: any},
    form: string,
    module?: string,
    type: any,
    context?: any,
    action?: string,
    definition?: any,
    firstOfRow?: boolean,
    first?: boolean,
    localFirst?: boolean,
}

export default ModuleTypeActionFormContent
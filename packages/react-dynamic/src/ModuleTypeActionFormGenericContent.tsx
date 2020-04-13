import React, {memo} from 'react';
import {useModuleFormGenericContent} from './hooks';

const ModuleTypeActionFormGenericContent = memo(({form, module, type, action, definition, disabled, submitting, errors}: ModuleTypeActionFormGenericContentProps) => {
    const [Component] = useModuleFormGenericContent(form, definition, {module, type, action});
    return (
        <Component disabled={disabled} submitting={submitting} errors={errors} name={definition.name} />
    );
});

export interface ModuleTypeActionFormGenericContentProps {
    form: string,
    module?: string,
    type: any,
    action?: string,
    definition?: any,
    disabled?: boolean,
    submitting?: boolean,
    errors: any,
}

export default ModuleTypeActionFormGenericContent
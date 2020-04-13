import React from 'react';
import component from '@ohoareau/react-component';
import ModuleTypeActionFormContent from './ModuleTypeActionFormContent';

const ModuleTypeActionFormContents = component<ModuleTypeActionFormContentsProps>({
    contentContainer: {
        marginBottom: 15,
    },
}, ({classes = {}, form, module, context, type, action, first, disabled, submitting, errors, contents = []}: ModuleTypeActionFormContentsProps) => (
    <>
        {((contents || []) as any[]).map((content, i) => (
            <div key={i} className={classes.contentContainer}>
                <ModuleTypeActionFormContent
                                             form={form}
                                             module={module} type={type} action={action}
                                             context={context}
                                             definition={content}
                                             first={first && (i === 0)}
                                             localFirst={true}
                                             disabled={disabled}
                                             submitting={submitting} errors={errors}
                />
            </div>
        ))}
    </>
));

export interface ModuleTypeActionFormContentsProps {
    classes?: {[key: string]: any},
    form: string,
    module?: string,
    context: any,
    type: any,
    action: string,
    first?: boolean,
    disabled?: boolean,
    submitting?: boolean,
    errors: any,
    contents?: any[],
}

export default ModuleTypeActionFormContents
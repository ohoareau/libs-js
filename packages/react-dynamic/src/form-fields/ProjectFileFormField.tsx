import React, {ComponentType, useCallback} from 'react';
import FileField from '../fields/FileField';
import {useMutation} from '@apollo/react-hooks';
import {getGraphQLQuery} from '@ohoareau/react-moduled';
import FormField, {FormFieldProps} from '../FormField';

export const ProjectFileFormField: ComponentType<ProjectFileFormFieldProps> = ({context, ...props}: ProjectFileFormFieldProps) => {
    const project = context.context.project.id;
    const [upload] = useMutation(getGraphQLQuery('REQUEST_PROJECT_FILE_UPLOAD_URL'));
    const getUploadParams = useCallback(async ({ meta: { name } }) => {
        const { data: {requestProjectFileUploadUrl: {fields: rawFields, uploadUrl, fileUrl}}} = await upload({
            variables: {project, file: name}});
        return { fields: JSON.parse(rawFields), meta: { fileUrl }, url: uploadUrl };
    }, [project, upload]);
    return (
        <FormField component={FileField} getUploadParams={getUploadParams} {...props} />
    );
};

export interface ProjectFileFormFieldProps extends FormFieldProps {}

export default ProjectFileFormField
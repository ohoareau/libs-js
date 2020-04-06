import React from 'react';
import component from '@ohoareau/react-component';
import {useQuery} from '@apollo/react-hooks';
import ImageContent from './ImageContent';
import TextFileContent from './TextFileContent';
import PdfViewerContent from './PdfViewerContent';
import {getGraphQLQuery} from '@ohoareau/react-moduled';

export const ProjectFileViewerContent = component<ProjectFileViewerContentProps>(undefined, ({data, context}: ProjectFileViewerContentProps) => {
    const project = context.context.project.id;
    const file = data.path;
    const contentType = data.type || 'application/octet-stream';
    const {data: d, loading, error} = useQuery(getGraphQLQuery('GET_PROJECT_FILE_VIEW_URL'), {variables: {project, file, contentType}});
    if (error) return <div>Error! ({error.message})</div>;
    if (loading) return <div>...</div>;
    const props = {data, context, path: (d || {})['getProjectFileViewUrl']['viewUrl'], contentType};
    switch (contentType) {
        case 'application/pdf': return <PdfViewerContent {...props} />;
        case 'image/jpeg': return <ImageContent {...props} />;
        case 'image/png': return <ImageContent {...props} />;
        case 'application/json': return <TextFileContent {...props} />;
        default: return /^text\//.test(contentType) ? <TextFileContent {...props} /> : <div />;
    }
});

export interface ProjectFileViewerContentProps {
    data?: any,
    context?: any,
}

export default ProjectFileViewerContent
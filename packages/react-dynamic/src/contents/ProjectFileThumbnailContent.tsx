import React from 'react';
import component from '@ohoareau/react-component';
import {useQuery} from '@apollo/react-hooks';
import ImageContent from './ImageContent';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getGraphQLQuery} from '@ohoareau/react-moduled';

export const types = {
    'application/json': 'JSON',
    'text/csv': 'Excel (CSV)',
    'text/plain': 'Texte',
    'image/jpeg': 'Image JPEG',
    'image/png': 'Image PNG',
    '*': 'Fichier',
};

export const mapType = t => types[t] || types['*'];

export const NoThumbnailContent = component<NoThumbnailContentProps>({
    root: {
    },
    smallContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    name: {
        fontSize: '1.1em',
        marginBottom: 10,
        marginTop: 15,
    },
    smallName: {
        fontSize: '1.1em',
    },
    contentType: {
        fontSize: '0.8em',
    },
}, ({classes = {}, data, contentType, size}: NoThumbnailContentProps) => (
    <div className={classes.root}>
        {size === 'small' && (
            <div className={classes.smallContainer}>
                <AttachFileIcon />
                <div>
                    <div className={classes.smallName}>{data.name || data.path}</div>
                    <div className={classes.contentType}>{mapType(contentType)}</div>
                </div>
            </div>
        )}
        {size !== 'small' && (
            <>
                <AttachFileIcon />
                <div className={classes.name}>{data.name || data.path}</div>
                <div className={classes.contentType}>{mapType(contentType)}</div>
            </>
        )}
    </div>
));

export interface NoThumbnailContentProps {
    classes?: {[key: string]: any},
    data,
    contentType,
    size,
}

export const FetchContentWrapper = component<FetchContentWrapperProps>(undefined, ({data, context, size, project, file, contentType, children}: FetchContentWrapperProps) => {
    const {data: d = {}, loading, error} = useQuery(getGraphQLQuery('GET_PROJECT_FILE_VIEW_URL'), {variables: {project, file, contentType}});
    if (error) return <div>Error! ({error.message})</div>;
    if (loading) return <div><CircularProgress /></div>;
    const props = {data, context, path: d['getProjectFileViewUrl']['viewUrl'], contentType, size};
    return children(props);
});

export interface FetchContentWrapperProps {
    data?: any,
    context?: any,
    size?: any,
    project?: any,
    file?: any,
    contentType?: any,
    children?: any,
}

export const ProjectFileThumbnailContent = component<ProjectFileThumbnailContentProps>(undefined, ({data, project, context, size}: ProjectFileThumbnailContentProps) => {
    project = project || context.context.project.id;
    const file = data.path;
    const contentType = data.type || 'application/octet-stream';
    switch (contentType) {
        case 'image/jpeg': return <FetchContentWrapper data={data} context={context} size={size} project={project} file={file} contentType={contentType}>{props => <ImageContent {...props} />}</FetchContentWrapper>;
        case 'image/png': return <FetchContentWrapper data={data} context={context} size={size} project={project} file={file} contentType={contentType}>{props => <ImageContent {...props} />}</FetchContentWrapper>;
        default: return <NoThumbnailContent data={data} contentType={contentType} size={size} />;
    }
});

export interface ProjectFileThumbnailContentProps {
    data?: any,
    project?: any,
    context?: any,
    size?: any,
}

export default ProjectFileThumbnailContent
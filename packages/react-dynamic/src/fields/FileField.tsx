import React, {useCallback} from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader/dist/react-dropzone-uploader';
import component from '@ohoareau/react-component';

export const DropZone = component<DropZoneProps>(undefined, ({t = () => {}, tReady = false, getUploadParams, value, onChange, multiple, accept = '.xls,.xlsx,.jpg,.jpeg,.gif,.png,.pdf,.rtf,.json,.csv,.zip,.txt'}: DropZoneProps) => {
    const handleChangeStatus = useCallback(({meta, remove}, status) => {
        if ('headers_received' === status) onChange(multiple ? [...value, meta] : meta);
    }, [onChange, value, multiple]);
    const handleSubmit = useCallback((files, allFiles) => allFiles.forEach(f => f.remove()), []);
    return (
        <Dropzone
            multiple={multiple}
            maxFiles={multiple ? undefined : 1}
            styles={{dropzone: {backgroundColor: 'white', minHeight: 300}, submitButtonContainer: {visibility: 'hidden'}}}
            inputContent={t(multiple ? 'dropzone_input_content_multiple' : 'dropzone_input_content')}
            inputWithFilesContent={t('dropzone_input_content_with_files')}
            getUploadParams={getUploadParams}
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept={accept}
            canCancel={true}
            submitButtonDisabled={true}
            submitButtonContent={null}
            SubmitButtonComponent={() => <div />}
        />
    );
});

export interface DropZoneProps {
    getUploadParams: any,
    value: any,
    onChange: any,
    multiple: any,
    accept: string,
    t?: Function,
    tReady?: boolean,
}

export const FileField = component<FileFieldProps>(undefined, ({errors, placeholder, label, input, multiple = false, ...props}: FileFieldProps) => (
    <DropZone multiple={multiple} {...props} value={input.value || (multiple ? [] : undefined)} onChange={input.onChange} />
));

export interface FileFieldProps {
    errors: any,
    placeholder: any,
    label: any,
    input: any,
    multiple?: boolean,
    getUploadParams: any,
    accept: string,
}

export default FileField
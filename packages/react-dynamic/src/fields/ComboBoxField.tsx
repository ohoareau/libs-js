import React, {Fragment, useEffect, useState} from 'react';
import TextField from './TextField';
import component from '@ohoareau/react-component';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

export const ComboBoxField = component<ComboBoxFieldProps>(undefined, ({freeSolo = false, multiple = false, input, loadItems, loading, error, items = undefined, ...props}: ComboBoxFieldProps) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (loading || error || items) return;
        (async () => await loadItems())();
    }, [loading, loadItems, error, items]);
    if (multiple) {
        input.value = input.value ? (Array.isArray(input.value) ? input.value.map(item => (items || []).find(i => item === i.id) || undefined).filter(x => !!x) : []) : [];
    } else {
        input.value = input.value ? ((items || []).find(i => input.value === i.id) || '') : '';
    }
    return (
        <Autocomplete
            disabled={error || loading}
            freeSolo={freeSolo}
            includeInputInList={true}
            value={input.value}
            onChange={(_, v) => {multiple ? input.onChange(v ? v.map(vv => vv.id) : []) : input.onChange(v ? v.id : undefined);}}
            onFocus={input.onFocus}
            multiple={multiple}
            open={open}
            onOpen={() => {setOpen(true);}}
            onClose={() => {setOpen(false);}}
            getOptionLabel={option => option ? (((option && option.name) ? option.name : (option.id ? option.id : '?')) || '') : ''}
            options={items || []}
            loading={loading}
            loadingText={'...'}
            onKeyPress={e=>{e.which === 13 && e.preventDefault();}}
            renderInput={params => (
                <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {(loading) ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                    {...props}
                />
            )}
        />
    );
}, undefined, {i18n: false});

export interface ComboBoxFieldProps {
    freeSolo?: boolean,
    multiple?: boolean,
    input?: any,
    loadItems?: any,
    loading?: any,
    error?: any,
    items?: any,
}

export default ComboBoxField
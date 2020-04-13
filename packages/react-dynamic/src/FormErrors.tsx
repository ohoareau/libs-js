import React from 'react';
import Card from '@material-ui/core/Card';
import component from '@ohoareau/react-component';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import {prepareErrors} from './utils';

export const FormErrors = component<FormErrorsProps>(theme => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    content: {
        paddingBottom: 16,
    },
}), ({classes = {}, errors, errorKey}: FormErrorsProps) => {
    errors = prepareErrors(errors, errorKey);
    return (
        <>
            {(errors && errors.length > 0) && (
                <Card elevation={0} className={classes.root}>
                    <CardContent className={classes.content}>
                        {errors.map((e, i) => <Typography key={i}>{e.message}</Typography>)}
                    </CardContent>
                </Card>
            )}
        </>
    );
});

export interface FormErrorsProps {
    classes?: {[key: string]: any},
    errors?: any,
    errorKey?: any,
}

export default FormErrors
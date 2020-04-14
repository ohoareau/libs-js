import React, {Fragment} from 'react';
import {datetimify} from '@ohoareau/string';
import component from '@ohoareau/react-component';

const FormattedValue = ({fromKey: key, value}) => {
    if ('object' === typeof value) {
        if (value.hasOwnProperty('value') && value.hasOwnProperty('unit')) value = `${value.value || '0'} ${value.unit}`;
        else value = JSON.stringify(value);
    }
    else if (Array.isArray(value)) value = JSON.stringify(value);
    else if (true === value || false === value) value = !!value ? 'Oui' : 'Non';
    else if (/email/i.test(key)) value = <a href={`mailto:${value}`}>{value}</a>;
    else if (/phone/i.test(key)) value = <a href={`tel:${value}`}>{value}</a>;
    else if (/fax/i.test(key)) value = <a href={`fax:${value}`}>{value}</a>;
    else if (/skype/i.test(key)) value = <a href={`callto:${value}`}>{value}</a>;
    else if (/website/i.test(key)) value = <a href={value} target={'_blank'} rel="noopener noreferrer">{value}</a>;
    return <>{value}</>;
};

const RowContent = component<RowContentProps>({
    row: {
        margin: 0,
        padding: 0,
        backgroundColor: 'rgb(255, 255, 255)',
    },
    rowInverted: {
        margin: 0,
        padding: 0,
        backgroundColor: 'rgb(250, 250, 250)',
    },
    keyColumn: {
        minWidth: 100,
        padding: '5px 10px 5px 10px',
        textDecoration: 'underline',
    },
    valueColumn: {
        padding: '5px 10px 5px 10px',
    },

}, ({classes = {}, t = () => {}, tReady = false, index, context, definition, data}: RowContentProps) => {
    definition = 'object' === typeof definition ? definition : {key: definition, value: data[definition]};
    const title = t([
        `module_${context.module}:field_${context.type.join('_')}_${definition.key.toLowerCase()}_label`,
        `module_core:field_${context.type.join('_')}_${definition.key.toLowerCase()}_label`,
        `field_${context.type.join('_')}_${definition.key.toLowerCase()}_label`,
        `module_core:field_${definition.key.toLowerCase()}_label`,
        `field_${definition.key.toLowerCase()}_label`,
        `${definition.key.substr(0, 1).toUpperCase()}${definition.key.substr(1)}`,
    ]);
    const value = definition.value;
    return (undefined !== value && '' !== value) ? (
        <tr className={(0 === (index % 2)) ? classes.row : classes.rowInverted}>
            <td className={classes.keyColumn}>{title}</td>
            <td className={classes.valueColumn}><FormattedValue fromKey={definition.key} value={value} /></td>
        </tr>
    ) : null;
});

export interface RowContentProps {
    classes?: {[key: string]: any},
    t?: Function,
    tReady?: boolean,
    index: any,
    context: any,
    definition: any,
    data: any,
}

const getProviderData = (provider, {data}) => {
    switch (provider) {
        case 'metadata':
            return [
                !data.locked && {key: 'Modifiable', value: 'Oui'},
                data.createdAt && {key: 'Créé le', value: datetimify(data.createdAt)},
                data.createdBy && ('module' !== data.createdBy) && {key: 'Créé par', value: data.createdBy},
                data.updatedAt && {key: 'Modifié le', value: datetimify(data.updatedAt)},
                data.updatedBy && ('module' !== data.updatedBy) && {key: 'Modifié par', value: data.updatedBy},
                data.locked && {key: 'Modifiable', value: 'Non'},
                (data.locked && data.lockCreatedAt) && {key: 'Verrouillé le', value: datetimify(data.lockCreatedAt)},
                (data.locked && data.lockCreatedAt && data.lockedBy) && {key: 'Verrouillé par', value: data.lockedBy},
                (data.locked && data.lockVersion) ? {key: 'N° de verrou', value: data.lockVersion} : undefined,
                !data.locked && data.lockCreatedAt && {key: 'Déverrouillé le', value: datetimify(data.lockCreatedAt)},
                !data.locked && data.lockCreatedAt && data.unlockedBy && {key: 'Déverrouillé par', value: data.unlockedBy},
            ].filter(x => !!x);
        default:
            return [];
    }
};

const buildRows = ({definition, data}) =>
    ('string' === typeof definition.data)
        ? getProviderData(definition.data, {data})
        : (definition.switch ? definition.data[data[definition.switch]] : definition.data) || []
;

const SectionContent = component<SectionContentProps>({
    head: {
    },
    headRow: {
        margin: 0,
        padding: 0,
    },
    headRowColumn: {
        textAlign: 'left',
        fontWeight: 'bolder',
        textTransform: 'capitalize',
        backgroundColor: 'white',
        padding: 10,
        fontSize: '1.05rem',
    },
    body: {
        margin: 0,
        padding: 0,
    },
}, ({classes = {}, context, definition, data}: SectionContentProps) => {
    const title = /^@/.test(definition.name) ? data[definition.name.substr(1)] : definition.name;
    return (
        <>
            {!!title && (
                <thead className={classes.head}>
                <tr className={classes.headRow}>
                    <th className={classes.headRowColumn} colSpan={2}>{title}</th>
                </tr>
                </thead>
            )}
            <tbody className={classes.body}>
            {buildRows({definition, data}).map((d, i) => <RowContent key={i} index={i} context={context} definition={d} data={data} />)}
            </tbody>
        </>
    );
});

export interface SectionContentProps {
    classes?: {[key: string]: any},
    context: any,
    definition: any,
    data: any,
}

export const PropertiesContent = component<PropertiesContentProps>({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        borderLeft: '1px solid rgb(245, 245, 245)',
        borderRight: '1px solid rgb(245, 245, 245)',
        borderBottom: '1px solid rgb(245, 245, 245)',
        borderTop: '1px solid rgb(245, 245, 245)',
        margin: 0,
        padding: 0,
        borderCollapse: 'collapse',
    },
}, ({classes = {}, context, contents, data}: PropertiesContentProps) => (
    <table className={classes.root}>
        {!!contents && contents.map((c, i) => ('section' === c.type)
            ? <SectionContent key={i} context={context} data={data} definition={c} />
            : <Fragment key={i} />
        )}
    </table>
));

export interface PropertiesContentProps {
    classes?: {[key: string]: any},
    context: any,
    contents: any,
    data: any,
}

export default PropertiesContent
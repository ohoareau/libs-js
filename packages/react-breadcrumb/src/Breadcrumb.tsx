import React, {Fragment, useCallback} from 'react';
import component from '@ohoareau/react-component';

const Breadcrumb = component<BreadcrumbProps>({
    span: {
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        }
    },
}, ({classes = {}, formatLabel, onSelect, item, context, parentScopes = [], scope}: BreadcrumbProps) => {
    const labelFormatter = useCallback(data =>
        formatLabel ? formatLabel(data) : (data.scope ? (data.scope.name || data.scope.title || data.scope.id) : '?')
    , [formatLabel]);
    const onClick = useCallback(scope => {
        onSelect({item, context, scope});
    }, [onSelect, item, context]);
    const items = [
        ...parentScopes.map(ps => ({label: labelFormatter({item, scope: ps}), scope: ps, onClick})),
        (item && scope) ? {label: labelFormatter({item, scope}), scope, emphasize: true} : undefined,
    ].filter(x => !!x);
    const lastIndex = items.length - 1;
    return (
        <>
            {items.map((it, i) => (
                <Fragment key={i}>
                    <span role={'breadcrumb-item'} className={classes.span} style={it.emphasize ? {fontWeight: 'bold'} : {}} onClick={onClick ? () => onClick(it.scope) : undefined}>{it.label}</span>{!(i === lastIndex) && ' / '}
                </Fragment>
            ))}
        </>
    );
}, undefined, {i18n: false});

export interface BreadcrumbProps {
    classes?: {[key: string]: any},
    formatLabel?: any,
    onSelect?: any,
    item?: any,
    context?: any,
    parentScopes?: any,
    scope?: any,
}

export default Breadcrumb
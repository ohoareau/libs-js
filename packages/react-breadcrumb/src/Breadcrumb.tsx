import React, {ComponentType, useCallback} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const Breadcrumb: ComponentType<BreadcrumbProps> = withStyles(() => ({
    span: {
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
        }
    },
}))(({classes = {}, formatLabel, onSelect, item, context, parentScopes = [], scope}: BreadcrumbProps) => {
    const labelFormatter = useCallback(data =>
        formatLabel ? formatLabel(data) : (data.scope ? (data.scope.name || data.scope.title || data.scope.id) : '?')
    , [formatLabel]);
    const onClick = useCallback(scope => {
        onSelect({item, context, scope});
    }, [onSelect, item, context]);
    const items = [
        ...parentScopes.map(ps => ({label: labelFormatter({item, scope: ps}), scope: ps, onClick})),
        {label: labelFormatter({item, scope}), scope, emphasize: true}
    ];
    const lastIndex = items.length - 1;
    return (
        <>
            {items.map((it, i) => (
                <>
                    <span key={i} className={classes.span} style={it.emphasize ? {fontWeight: 'bold'} : {}} onClick={onClick ? () => onClick(scope) : undefined}>{it.label}</span>{!(i === lastIndex) && ' / '}
                </>
            ))}
        </>
    );
});

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
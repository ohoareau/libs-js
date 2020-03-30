import React, {ComponentType} from 'react';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import {lighten} from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withTranslation} from 'react-i18next';

// noinspection TypeScriptValidateJSTypes
const DataTableToolBar: ComponentType<DataTableToolBarProps> = withStyles((theme: any) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
    filterPanel: {
        padding: 30,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
}))(withTranslation()(({t = () => {}, buttonComponent, selectionHeader = false, filterPanelComponent: FilterPanelComp, comparable = 0, onCompareClick, filterOpened, title, subTitle, content, classes = {}, selectedCount, count, totalCount, enabled = true, loading = false, onToggleFilterOpened, filters, onFiltersChange, actions = []}: DataTableToolBarProps) => {
    const Button: any = buttonComponent;
    const hasFilters = !!Object.keys(filters || {}).length;
    const filterable = !!FilterPanelComp;
    // noinspection PointlessBooleanExpressionJS
    return enabled ? (
        <>
            <Toolbar className={clsx(classes.root, ((selectionHeader && !!selectedCount) || filterOpened) && classes.highlight)}>
                {(selectionHeader && !!selectedCount) ? (
                    <Typography className={classes.title} color="inherit" variant="subtitle1">
                        {t('tables_generic_main_toolbar_selected_title', {count: selectedCount})}
                    </Typography>
                ) : (
                    <div className={classes.title}>
                        <Typography variant="h6" id="tableTitle">{t(title)}{(count || 0) > 1 ? ` (${totalCount !== count ? `${count} sur ${totalCount}` : count})` : ''}</Typography>
                        {subTitle}
                    </div>
                )}
                {loading && (
                    <Tooltip title="Loading">
                        <IconButton aria-label="loading"><CircularProgress size={32} /></IconButton>
                    </Tooltip>
                )}
                {(comparable >= 2) && <Button style={{marginRight: 5, width: 175}} aria-label="compare list" color={'secondary'} onClick={onCompareClick} label={t('table_compare_label', {count: comparable})} />}
                {!!filterable && <Button aria-label="filter list" color={filterOpened ? 'primary' : (hasFilters ? 'secondary' : 'inherit')} onClick={onToggleFilterOpened} label={t('table_filters_label')} endIcon={(hasFilters && !filterOpened) ? <CheckIcon /> : null} startIcon={filterOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />} />}
                <div style={{marginLeft: actions.length > 0 ? 10 : 0}}>
                    {actions.map(({component: Component, onClick}, i) => <Component key={i} onClick={onClick} />)}
                </div>
            </Toolbar>
            {content}
            {filterOpened && FilterPanelComp && (
                <div className={classes.filterPanel}>
                    <FilterPanelComp filters={filters} onChange={onFiltersChange} onReset={() => onFiltersChange && onFiltersChange({})} />
                </div>
            )}
        </>
    ) : null;
}));

export interface DataTableToolBarProps {
    t?: Function,
    buttonComponent?: Function,
    selectionHeader?: boolean,
    filterPanelComponent?: Function,
    comparable?: number,
    onCompareClick?: Function,
    filterOpened?: boolean,
    title?: string,
    subTitle?: string,
    content?: JSX.Element,
    classes?: {[key: string]: any},
    selectedCount?: number,
    count?: number,
    totalCount?: number,
    enabled?: boolean,
    loading?: boolean,
    onToggleFilterOpened?: Function,
    filters?: any,
    onFiltersChange?: Function,
    actions?: any[],
}

export default DataTableToolBar;
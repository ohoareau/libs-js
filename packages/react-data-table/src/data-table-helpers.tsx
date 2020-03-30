import React from 'react';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

export const desc = (a, b, orderBy) => (b[orderBy] < a[orderBy]) ? -1 : ((b[orderBy] > a[orderBy]) ? 1 : 0);

export const getSorting = (order, orderBy) =>
    order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
;

export const stableSort = (array, cmp) => {
    const a = array.map((el, index) => [el, index]);
    a.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        return (order !== 0) ? order : (a[1] - b[1]);
    });
    return a.map(el => el[0]);
};

export const formatize = (f, {t, id, ...cfg}) => {
    if ('string' !== typeof f) return f;
    switch (f) {
        case 'flag':
            return (v) => !!v ? <Chip label={t([`flag_${id}_label`, id])} deleteIcon={<DoneIcon />} /> : '';
        case 'upper':
            return (v) => v ? v.toUpperCase() : undefined;
        case 'subcount':
            return (v, data) => data[id] ? (data[id].items.length || '') : '-';
        case 'sublist':
            return (v, data) => data[id] ? (data[id].items.map(it => it.name).join(', ') || '') : '-';
        case 'count':
            return (v, data) => data[id] ? ((data[id] || []).length || '') : '-';
        case 'value':
            return v => v ? `${Math.round(v.value * 1000) / 1000} ${v.unit}` : undefined;
        case 'i18n':
            // noinspection RegExpRedundantEscape
            return v => v ? t([(cfg.pattern || v || '').replace(/\{\{value\}\}/g, v || ''), v || '']) : undefined;
        default:
            return f = (v) => (!!v && 'object' === typeof v) ? ((v.value && v.unit) ? `${Math.round(v.value * 1000) / 1000} ${v.unit}` : `${v}`) : v;
    }
};

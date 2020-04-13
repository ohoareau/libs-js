export const peopleSorter = (a, b) =>
    `${a.name|| ''}-${a.lastName || ''}-${a.firstName || ''}` <= `${b.name|| ''}-${b.lastName || ''}-${b.firstName || ''}`
        ? -1
        : 1
;

export const updatedAtSorter = (a, b) => a.updatedAt > b.updatedAt ? -1 : 1;

export const labelSorter = (a, b) => a.label > b.label ? 1 : (a.label < b.label ? -1 : 0);

export const prioritySorter = (a, b) => (a.priority > b.priority) ? -1 : ((b.priority > a.priority) ? 1 : -1);
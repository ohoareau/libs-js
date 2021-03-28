import applyCleaner from "./applyCleaner";

export function clean(raw: string): any {
    const features: any = {};
    // `cleaner`s are limitation of the underlying parsing library that require pre-cleaning
    const cleaners = [
        'drop-table-if-exists',
        'create-table-collate',
        //'create-table-not-null-default',
        'create-table-key-length',
        'create-table-on-update',
    ];
    raw = cleaners.reduce((x, name) => applyCleaner(name, x, features), raw);
    return [raw, features];
}

export default clean
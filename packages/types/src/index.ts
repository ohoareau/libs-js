export type Tags = string[];

export type Features = {
    [K: string]: boolean;
}

export type Address = {
    zipCode?: string;
    city?: string;
    line?: string;
    line2?: string;
    country?: string;
    county?: string;
    state?: string;
}

export type File = {
    bucket: string;
    key: string;
    region: string;
    name?: string;
}

export type Image = File & {
    format: string;
}
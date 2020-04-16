export interface fontType {
    src: string,
    [key: string]: any,
}

export interface font {
    family: string,
    fonts: fontType[],
}

export interface stylesheet {
    id: string,
    name: string,
    description: string,
    fonts?: font[],
    variables?: {[key: string]: any},
    types?: {[key: string]: any},
    extends?: string,
}

export interface stylesheets {
    [key: string]: stylesheet,
}
export function parseFormat(name: string) {
    return name.split(/./g).pop();
}

export function parseDsn(string: string) {
    const [type, location = undefined] = string.split(/:\/\//);
    return {type: location ? type : 'file', location: location || type};
}


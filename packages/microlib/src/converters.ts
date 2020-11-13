export const upper = () => v => `${v}`.toUpperCase();
export const lower = () => v => `${v}`.toLowerCase();
export const jsonParse = () => v => v ? JSON.parse(v) : undefined;

export const upper = () => v => `${v}`.toUpperCase();
export const lower = () => v => `${v}`.toLowerCase();
export const password = ({rounds}) => v => require('bcryptjs').hashSync(v, rounds);
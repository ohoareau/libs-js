const upper = () => v => `${v}`.toUpperCase();
const lower = () => v => `${v}`.toLowerCase();
const password = ({rounds}) => v => require('bcryptjs').hashSync(v, rounds);

module.exports = {upper, lower, password};
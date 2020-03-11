const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const uuid = () => () => require('uuid/v4')();
export const now = () => () => new Date().valueOf();
export const ref_attribute_field = ({key, prefix, sourceField}) => ({data, contextData}) => {
    if (!data || !data[key]) return '**unchanged**';
    return (contextData[`${prefix}.${data[key]}`] || {})[sourceField] || undefined;
};
export const empty = () => () => undefined;
export const value = ({value}) => () => value;
export const ccdd = () => () => {
    const t: (string|number)[] = [];
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const cccddd = () => () => {
    const t: (string|number)[] = [];
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};